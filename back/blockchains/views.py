import asyncio

from django.conf import settings
from django.db import transaction

from rest_framework import views, response, status

from blockchains.models import Blockchain, BlockchainValidator
from blockchains.serilazers import (
    RpcValidatorSerializer,
    BlockchainValidatorSerializer,
    InfosValidatorSerializer,
)
from blockchains.permissions import IsPrometheusUserAgent
from blockchains.utils.cosmos_fetch_rpc_url import cosmos_fetch_rpc_url
from blockchains.utils.cosmos_fetch_validators_url import cosmos_fetch_validators_url
from blockchains.utils.cosmos_fetch_infos_url import cosmos_fetch_infos_url
from blockchains.utils.hex_to_celestiavalcons import hex_to_celestiavalcons
from blockchains.utils.convert_valoper_to_wallet import convert_valoper_to_wallet
from blockchains.utils.calculate_uptime import calculate_uptime
from logs.models import Log


class BlockchainMetrics(views.APIView):
    permission_classes = (IsPrometheusUserAgent,)

    async def _process_urls(self, rpc_urls, validators_urls, infos_urls):
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
            return_exceptions=True,
        )
        return results

    def get(self, request):
        blockchain = Blockchain.objects.filter(
            btype=Blockchain.Type.COSMOS, status=True
        ).first()
        if not blockchain:
            return response.Response(status=status.HTTP_404_NOT_FOUND)

        rpc_urls, validators_urls, infos_urls = zip(
            *blockchain.blockchain_urls.order_by("priority").values_list(
                "rpc_url", "validators_url", "infos_url"
            )
        )

        results = asyncio.run(
            self._process_urls(
                rpc_urls=rpc_urls,
                validators_urls=validators_urls,
                infos_urls=infos_urls,
            )
        )

        urls_types = ["RPC", "Validators", "Infos"]
        for idx, result in enumerate(results):
            if isinstance(result, Exception):
                Log.error(f"Can't fetching {urls_types[idx]}: {result}")
                return response.Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        # Validate Data
        rpc_serializer = RpcValidatorSerializer(data=results[0], many=True)
        if not rpc_serializer.is_valid():
            return response.Response(
                rpc_serializer.errors,
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        validators_serializer = BlockchainValidatorSerializer(
            data=results[1], many=True
        )
        if not validators_serializer.is_valid():
            return response.Response(
                validators_serializer.errors,
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        infos_serializer = InfosValidatorSerializer(data=results[2], many=True)
        if not infos_serializer.is_valid():
            return response.Response(
                infos_serializer.errors,
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        # Format Data
        rpc_data = {
            item["pub_key"]["value"]: item for item in rpc_serializer.validated_data
        }
        infos_data = {item["address"]: item for item in infos_serializer.validated_data}

        # Get local data
        validators_local = {
            item.operator_address: item
            for item in blockchain.blockchain_validators.iterator()
        }

        validators_to_update = []
        for validator_row in validators_serializer.validated_data:
            operator_address = validator_row["operator_address"]
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
                if validator.jailed != jailed:
                    updated_fields["jailed"] = jailed
                if validator.tombstoned != tombstoned:
                    updated_fields["tombstoned"] = tombstoned
                if validator.status != validator_status:
                    updated_fields["status"] = validator_status

                if updated_fields:
                    validators_to_update.append((validator, updated_fields))

            else:
                # Create Validator (if not exists)
                print("INFO: Creating BlockchainValidator: ", operator_address)
                BlockchainValidator.objects.create(
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

        # Update Validators (TODO: RQ Task)
        if validators_to_update:
            print("INFO: Updating BlockchainValidator: ", validators_to_update)
            with transaction.atomic():
                for validator, updated_fields in validators_to_update:
                    BlockchainValidator.objects.filter(id=validator.id).update(
                        **updated_fields
                    )

        # return response.Response(
        #     {
        #         "rpc-data": results[0],
        #         "validators-data": results[1],
        #         "infos-data": results[2],
        #     },
        #     status=status.HTTP_200_OK,
        # )

        return response.Response(
            "# Metrics collection is temporarily disabled\n",
            content_type="text/plain",
            status=status.HTTP_200_OK,
        )
