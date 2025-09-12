import asyncio
import pytz
import time
from prometheus_client import Gauge, generate_latest

from django.conf import settings
from django.db import transaction
from django.db.models import Sum
from django.utils.timezone import now
from django.http import HttpResponse
from django.shortcuts import get_object_or_404

from rest_framework import views, permissions, response, status

from blockchains.constants import CHART_PERIODS
from blockchains.models import Blockchain, BlockchainValidator, BlockchainBridge
from blockchains.serilazers import (
    BlockchainValidatorModelSerializer,
    BlockchainBridgeModelSerializer,
    BlockchainValidatorDetailModelSerializer,
    RpcValidatorSerializer,
    BlockchainValidatorSerializer,
    InfosValidatorSerializer,
    ValidatorChartsSerializer,
    GrafanaChartSerializer,
)
from blockchains.permissions import IsPrometheusUserAgent
from blockchains.filters import BlockchainValidatorFilter, BlockchainBridgeFilter
from blockchains.utils.cosmos_fetch_rpc_url import cosmos_fetch_rpc_url
from blockchains.utils.cosmos_fetch_validators_url import cosmos_fetch_validators_url
from blockchains.utils.cosmos_fetch_infos_url import cosmos_fetch_infos_url
from blockchains.utils.cosmos_fetch_da_url import cosmos_fetch_da_url
from blockchains.utils.hex_to_celestiavalcons import hex_to_celestiavalcons
from blockchains.utils.convert_valoper_to_wallet import convert_valoper_to_wallet
from blockchains.utils.calculate_uptime import calculate_uptime
from blockchains.utils.grafana_fetch_metrics import grafana_fetch_metrics
from logs.models import Log
from alerts.tasks import check_alerts
from blockchains.caches import CachedMetrics


class CosmosBlockchainMetricsView(views.APIView):
    permission_classes = (IsPrometheusUserAgent,)

    cached_metrics = CachedMetrics(ttl=5)
    voting_power_metric = Gauge(
        f"{Blockchain.Type.COSMOS}_validator_voting_power",
        "Voting power of the validator",
        ["blockchain_id", "validator_id", "moniker"],
    )
    commission_rate_metric = Gauge(
        f"{Blockchain.Type.COSMOS}_validator_commission_rate",
        "Commission rate of the validator",
        ["blockchain_id", "validator_id", "moniker"],
    )
    uptime_metric = Gauge(
        f"{Blockchain.Type.COSMOS}_validator_uptime",
        "Uptime of the validator",
        ["blockchain_id", "validator_id", "moniker"],
    )

    async def _process_urls(
        self, ntype, rpc_urls, validators_urls, infos_urls, da_urls
    ):
        results = await asyncio.gather(
            cosmos_fetch_rpc_url(
                urls=rpc_urls,
                timeout=settings.METRICS_TIMEOUT_SECONDS,
            ),
            cosmos_fetch_validators_url(
                urls=validators_urls,
                timeout=settings.METRICS_TIMEOUT_SECONDS,
            ),
            cosmos_fetch_infos_url(
                urls=infos_urls,
                timeout=settings.METRICS_TIMEOUT_SECONDS,
            ),
            cosmos_fetch_da_url(
                ntype,
                urls=da_urls,
                timeout=settings.METRICS_TIMEOUT_SECONDS,
            ),
            return_exceptions=True,
        )
        return results

    def get(self, request, blockchain_id):
        start = time.perf_counter()
        blockchain = get_object_or_404(
            Blockchain, pk=blockchain_id, btype=Blockchain.Type.COSMOS, status=True
        )
        blockchain_urls = blockchain.blockchain_urls.order_by("priority")

        if not blockchain_urls.count():
            return response.Response(status=status.HTTP_404_NOT_FOUND)

        rpc_urls, validators_urls, infos_urls = zip(
            *blockchain_urls.values_list("rpc_url", "validators_url", "infos_url")
        )

        # print(f"get data from db: {time.perf_counter() - start:.6f}")

        results = asyncio.run(
            self._process_urls(
                ntype=blockchain.ntype,
                rpc_urls=rpc_urls,
                validators_urls=validators_urls,
                infos_urls=infos_urls,
                da_urls=[blockchain.da_url] if blockchain.da_url else [],
            )
        )

        urls_types = ["RPC", "Validators", "Infos", "Status", "DA"]
        for idx, result in enumerate(results):
            if isinstance(result, Exception):
                Log.error(f"Can't fetching {urls_types[idx]}: {result}")
                return response.Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        # print(f"got API data: {time.perf_counter() - start:.6f}")

        network_height = results[0]["network_height"]

        # Update blockchain status info (latest_block_height)
        print(f"Updating Blockchain {blockchain.id} network height {network_height}")
        Blockchain.objects.filter(pk=blockchain.id).update(
            network_height=network_height
        )

        # Validate Data
        rpc_serializer = RpcValidatorSerializer(
            data=results[0]["validators"], many=True
        )
        if not rpc_serializer.is_valid():
            print(111, rpc_serializer.errors)
            return response.Response(
                rpc_serializer.errors,
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        validators_serializer = BlockchainValidatorSerializer(
            data=results[1], many=True
        )
        if not validators_serializer.is_valid():
            print(222, validators_serializer.errors)
            return response.Response(
                validators_serializer.errors,
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        infos_serializer = InfosValidatorSerializer(data=results[2], many=True)
        if not infos_serializer.is_valid():
            print(333, infos_serializer.errors)
            return response.Response(
                infos_serializer.errors,
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        # print(f"validated serializers: {time.perf_counter() - start:.6f}")

        # Format Data
        rpc_data = {
            item["pub_key"]["value"]: item for item in rpc_serializer.validated_data
        }
        infos_data = {item["address"]: item for item in infos_serializer.validated_data}

        # Get local validators data
        validators_local = {
            item.operator_address.lower(): item
            for item in blockchain.blockchain_validators.iterator()
        }

        # Get local bridges data
        bridges_local = {
            item.node_id: item for item in blockchain.blockchain_bridges.iterator()
        }

        # print(f"got local validators and bridges: {time.perf_counter() - start:.6f}")

        if blockchain.id == 6:
            print("VALIDATORS: ", len(validators_serializer.validated_data))

        # Update Validators
        validators_to_update = []
        validators_to_update_prev = {
            "uptime": {},
            "jailed": {},
            "status": {},
        }
        for validator_row in validators_serializer.validated_data:
            operator_address = validator_row["operator_address"].lower()
            validator = validators_local.get(operator_address)

            pubkey_type = validator_row["consensus_pubkey"]["type"]
            pubkey_key = validator_row["consensus_pubkey"]["key"]
            moniker = validator_row["description"].get("moniker")
            identity = validator_row["description"].get("identity")
            website = validator_row["description"].get("website")
            contact = validator_row["description"].get("security_contact")
            details = validator_row["description"].get("details")
            rpc_row = rpc_data.get(validator_row["consensus_pubkey"]["key"], {})
            wallet_address = convert_valoper_to_wallet(operator_address)
            hex_address = rpc_row.get("address")
            valcons_address = hex_to_celestiavalcons(hex_address)
            infos_row = infos_data.get(valcons_address, {})
            voting_power = rpc_row.get("voting_power", 0)
            commision_rate = validator_row["commission"]["commission_rates"]["rate"]
            commision_max_rate = validator_row["commission"]["commission_rates"][
                "max_rate"
            ]
            commision_max_change_rate = validator_row["commission"]["commission_rates"][
                "max_change_rate"
            ]
            jailed = validator_row["jailed"]
            tombstoned = infos_row.get("tombstoned", False)
            validator_status = validator_row["status"]
            missed_blocks_counter = infos_row.get("missed_blocks_counter", 0)
            uptime = calculate_uptime(
                missed_blocks_counter=missed_blocks_counter,
                validator_status=validator_status,
            )

            # fix voting_power for Story & Provenance
            if blockchain.ntype in [
                Blockchain.NetworkType.STORY_TESTNET,
                Blockchain.NetworkType.STORY_MAINNET,
                Blockchain.NetworkType.PROVENANCE_TESTNET,
                Blockchain.NetworkType.PROVENANCE_MAINNET,
            ]:
                voting_power = round(voting_power / 1_000)

            if validator:
                updated_fields = {}
                if validator.pubkey_type != pubkey_type:
                    updated_fields["pubkey_type"] = pubkey_type
                if validator.pubkey_key != pubkey_key:
                    updated_fields["pubkey_key"] = pubkey_key
                if validator.moniker != moniker:
                    updated_fields["moniker"] = moniker
                if validator.identity != identity:
                    updated_fields["identity"] = identity
                if validator.website != website:
                    updated_fields["website"] = website
                if validator.contact != contact:
                    updated_fields["contact"] = contact
                if validator.details != details:
                    updated_fields["details"] = details
                if validator.wallet_address != wallet_address:
                    updated_fields["wallet_address"] = wallet_address
                if validator.hex_address != hex_address:
                    updated_fields["hex_address"] = hex_address
                if validator.valcons_address != valcons_address:
                    updated_fields["valcons_address"] = valcons_address
                if validator.voting_power != voting_power:
                    updated_fields["voting_power"] = voting_power
                if validator.commision_rate != commision_rate:
                    updated_fields["commision_rate"] = commision_rate
                if validator.commision_max_rate != commision_max_rate:
                    updated_fields["commision_max_rate"] = commision_max_rate
                if validator.commision_max_change_rate != commision_max_change_rate:
                    updated_fields["commision_max_change_rate"] = (
                        commision_max_change_rate
                    )
                if validator.missed_blocks_counter != missed_blocks_counter:
                    updated_fields["missed_blocks_counter"] = missed_blocks_counter
                if validator.uptime != uptime:
                    updated_fields["uptime"] = uptime
                    validators_to_update_prev["uptime"][validator.id] = validator.uptime
                if validator.jailed != jailed:
                    updated_fields["jailed"] = jailed
                    validators_to_update_prev["jailed"][validator.id] = validator.jailed
                if validator.tombstoned != tombstoned:
                    updated_fields["tombstoned"] = tombstoned
                if validator.status != validator_status:
                    updated_fields["status"] = validator_status
                    validators_to_update_prev["status"][validator.id] = (
                        validator.status
                        == BlockchainValidator.Status.BOND_STATUS_BONDED
                    )

                if updated_fields:
                    validators_to_update.append((validator.id, updated_fields))

            else:
                # Create Validator (if not exists)
                print("INFO: Creating BlockchainValidator: ", operator_address)
                validator = BlockchainValidator.objects.create(
                    blockchain=blockchain,
                    operator_address=operator_address,
                    pubkey_type=pubkey_type,
                    pubkey_key=pubkey_key,
                    moniker=moniker,
                    identity=identity,
                    website=website,
                    contact=contact,
                    details=details,
                    voting_power=voting_power,
                    commision_rate=commision_rate,
                    commision_max_rate=commision_max_rate,
                    commision_max_change_rate=commision_max_change_rate,
                    missed_blocks_counter=missed_blocks_counter,
                    uptime=uptime,
                    hex_address=hex_address,
                    valcons_address=valcons_address,
                    wallet_address=wallet_address,
                    jailed=jailed,
                    tombstoned=tombstoned,
                    status=validator_status,
                )

            # Prometheus metrics
            self.voting_power_metric.labels(
                blockchain_id=blockchain_id,
                validator_id=validator.id,
                moniker=moniker,
            ).set(voting_power)
            self.commission_rate_metric.labels(
                blockchain_id=blockchain_id,
                validator_id=validator.id,
                moniker=moniker,
            ).set(commision_rate)
            self.uptime_metric.labels(
                blockchain_id=blockchain_id,
                validator_id=validator.id,
                moniker=moniker,
            ).set(uptime)

        if validators_to_update:
            print("INFO: Updating BlockchainValidator: ", validators_to_update)
            with transaction.atomic():
                for validator_id, updated_fields in validators_to_update:
                    BlockchainValidator.objects.filter(id=validator_id).update(
                        **updated_fields,
                        updated=now(),
                    )

        # print(f"updated validators: {time.perf_counter() - start:.6f}")

        # Bridges
        now_timestamp = int(now().timestamp())
        bridges_to_update = []
        bridges_from_to_update_alerts = {
            "node_height_diff": {},
            "last_timestamp_diff": {},
        }

        # Create Bridges
        for node_id, bridge in results[3].items():
            if not bridges_local.get(node_id):
                bridges_local[node_id] = BlockchainBridge.objects.create(
                    blockchain=blockchain,
                    node_id=node_id,
                    version=bridge["semantic_version"],
                    system_version=bridge["system_version"],
                    node_height=bridge["node_height"],
                    last_timestamp=bridge.get("last_timestamp", now_timestamp),
                )

        # print(f"created bridges: {time.perf_counter() - start:.6f}")

        # Update Bridges
        for node_id, bridge in bridges_local.items():
            updated_data = results[3].get(node_id, {})

            semantic_version = updated_data.get("semantic_version", bridge.version)
            system_version = updated_data.get("system_version", bridge.system_version)
            node_height = max(
                updated_data.get("node_height", bridge.node_height), bridge.node_height
            )
            last_timestamp = max(
                updated_data.get("last_timestamp", bridge.last_timestamp),
                bridge.last_timestamp,
            )
            last_timestamp_diff = int(now_timestamp - last_timestamp)
            node_height_diff = max(0, network_height - node_height)

            updated_fields = {}
            if bridge.version != semantic_version:
                updated_fields["version"] = semantic_version

            if bridge.system_version != system_version:
                updated_fields["system_version"] = system_version

            if bridge.node_height != node_height:
                updated_fields["node_height"] = node_height

            if bridge.last_timestamp != last_timestamp:
                updated_fields["last_timestamp"] = last_timestamp

            if bridge.node_height_diff != node_height_diff:
                updated_fields["node_height_diff"] = node_height_diff
                bridges_from_to_update_alerts["node_height_diff"][bridge.id] = (
                    bridge.node_height_diff,
                    node_height_diff,
                )

            if bridge.last_timestamp_diff != last_timestamp_diff:
                updated_fields["last_timestamp_diff"] = last_timestamp_diff
                bridges_from_to_update_alerts["last_timestamp_diff"][bridge.id] = (
                    bridge.last_timestamp_diff,
                    last_timestamp_diff,
                )

            if updated_fields:
                bridges_to_update.append((bridge.id, updated_fields))

        if bridges_to_update:
            # print("INFO: Updating BlockchainBridges: ", bridges_to_update)
            with transaction.atomic():
                for bridge_id, updated_fields in bridges_to_update:
                    BlockchainBridge.objects.filter(id=bridge_id).update(
                        **updated_fields,
                        updated=now(),
                    )

        # print(f"updated bridges: {time.perf_counter() - start:.6f}")

        # Alerts
        job = check_alerts.delay(
            validators_to_update=validators_to_update,
            validators_to_update_prev=validators_to_update_prev,
            bridges_from_to_update_alerts=bridges_from_to_update_alerts,
        )

        # print(f"before response: {time.perf_counter() - start:.6f}")

        # print("bridges_from_to_update_alerts: ", bridges_from_to_update_alerts)

        return HttpResponse(
            self.cached_metrics.get_latest(),
            content_type="text/plain; version=0.0.4; charset=utf-8",
            status=status.HTTP_200_OK,
        )


class BlockchainValidatorsView(views.APIView):
    permission_classes = (permissions.AllowAny,)
    filterset_class = BlockchainValidatorFilter

    def get(self, request, blockchain_id):
        blockchain = get_object_or_404(
            Blockchain, pk=blockchain_id, btype=Blockchain.Type.COSMOS, status=True
        )

        blockchain_validators = blockchain.blockchain_validators.all()

        validators_filter = self.filterset_class(
            request.GET,
            request=request,
            queryset=blockchain_validators.select_related("blockchain").order_by(
                "-voting_power"
            ),
        )

        total_voting_power = (
            blockchain_validators.aggregate(total_voting_power=Sum("voting_power"))[
                "total_voting_power"
            ]
            or 0
        )

        queryset = validators_filter.qs
        serializer = BlockchainValidatorModelSerializer(queryset, many=True)

        data_with_rank = [
            {
                **item,
                "rank": index + 1,
                "voting_power_percentage": (
                    (item["voting_power"] / total_voting_power) * 100
                    if total_voting_power > 0
                    else 0
                ),
            }
            for index, item in enumerate(serializer.data)
        ]

        return response.Response(
            {
                "network_height": blockchain.network_height,
                "validators": data_with_rank,
            },
            status=status.HTTP_200_OK,
        )


class BlockchainBridgesView(views.APIView):
    permission_classes = (permissions.AllowAny,)
    filterset_class = BlockchainBridgeFilter

    def get(self, request, blockchain_id):
        blockchain = get_object_or_404(
            Blockchain, pk=blockchain_id, btype=Blockchain.Type.COSMOS, status=True
        )

        blockchain_bridges = blockchain.blockchain_bridges.all()

        bridges_filter = self.filterset_class(
            request.GET,
            request=request,
            queryset=blockchain_bridges.select_related("blockchain").order_by(
                "-node_height"
            ),
        )

        queryset = bridges_filter.qs
        serializer = BlockchainBridgeModelSerializer(queryset, many=True)

        data_with_rank = [
            {**item, "rank": index + 1} for index, item in enumerate(serializer.data)
        ]

        return response.Response(
            {
                "network_height": blockchain.network_height,
                "bridges": data_with_rank,
            },
            status=status.HTTP_200_OK,
        )


class BlockchainValidatorView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, blockchain_id, validator_id):
        validator = get_object_or_404(
            BlockchainValidator,
            pk=validator_id,
            blockchain__id=blockchain_id,
            blockchain__status=True,
        )

        serializer = BlockchainValidatorDetailModelSerializer(validator)
        return response.Response(serializer.data, status=status.HTTP_200_OK)


class BlockchainChartView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    async def _process_urls(
        self,
        validator_ids: list[int],
        step: str,
        start_time: int,
        end_time: int,
    ):

        results = await asyncio.gather(
            grafana_fetch_metrics(
                chart_type=Blockchain.ChartType.COSMOS_UPTIME,
                validator_ids=validator_ids,
                step=step,
                start_time=start_time,
                end_time=end_time,
            ),
            grafana_fetch_metrics(
                chart_type=Blockchain.ChartType.COSMOS_COMISSION,
                validator_ids=validator_ids,
                step=step,
                start_time=start_time,
                end_time=end_time,
            ),
            grafana_fetch_metrics(
                chart_type=Blockchain.ChartType.COSMOS_VOTING_POWER,
                validator_ids=validator_ids,
                step=step,
                start_time=start_time,
                end_time=end_time,
            ),
            return_exceptions=True,
        )
        return results

    def get(self, request):
        serializer = ValidatorChartsSerializer(data=request.GET)
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        if serializer.validated_data.get(
            "date_start"
        ) and serializer.validated_data.get("date_end"):
            start_time = (
                serializer.validated_data["date_start"].astimezone(pytz.UTC).timestamp()
            )
            end_time = (
                serializer.validated_data["date_end"].astimezone(pytz.UTC).timestamp()
            )
        else:
            start_time = (
                now() - CHART_PERIODS[serializer.validated_data["period"]]["delta"]
            ).timestamp()
            end_time = now().timestamp()

        results = asyncio.run(
            self._process_urls(
                validator_ids=serializer.validated_data["validator_ids"],
                step=serializer.validated_data.get(
                    "step", CHART_PERIODS[serializer.validated_data["period"]]["step"]
                ),
                start_time=int(start_time),
                end_time=int(end_time),
            )
        )

        # Validate charts data
        charts_data = {
            Blockchain.ChartType.COSMOS_UPTIME.value: {},
            Blockchain.ChartType.COSMOS_COMISSION.value: {},
            Blockchain.ChartType.COSMOS_VOTING_POWER.value: {},
        }
        for idx, chart_type in enumerate(charts_data.keys()):
            if isinstance(results[idx], Exception):
                print(
                    f"ERROR: Can't get {chart_type} charts from Grafana: {str(results[idx])}"
                )
                continue

            chart_serializer = GrafanaChartSerializer(data=results[idx], many=True)
            if not chart_serializer.is_valid():
                print(
                    f"ERROR: Can't serialize the {chart_type}: {chart_serializer.errors}"
                )
                continue

            for data in chart_serializer.validated_data:
                charts_data[data["metric"]["__name__"]][
                    data["metric"]["validator_id"]
                ] = data["values"]

        return response.Response(charts_data, status=status.HTTP_200_OK)
