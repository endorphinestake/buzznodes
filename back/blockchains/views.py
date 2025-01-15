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

        # Get local data
        validators_local = {
            item.operator_address: item
            for item in blockchain.blockchain_validators.all()
        }

        validators_to_update = []
        for row in validators_serializer.validated_data:
            validator = validators_local.get(row["operator_address"])

            if validator:
                updated_fields = {}

                if validator.pubkey_type != row["consensus_pubkey"]["type"]:
                    updated_fields["pubkey_type"] = row["consensus_pubkey"]["type"]
                if validator.pubkey_key != row["consensus_pubkey"]["key"]:
                    updated_fields["pubkey_key"] = row["consensus_pubkey"]["key"]
                if validator.moniker != row["description"].get("moniker"):
                    updated_fields["moniker"] = row["description"].get("moniker")
                if validator.jailed != row["jailed"]:
                    updated_fields["jailed"] = row["jailed"]
                if validator.identity != row["description"].get("identity"):
                    updated_fields["identity"] = row["description"].get("identity")
                if validator.website != row["description"].get("website"):
                    updated_fields["website"] = row["description"].get("website")
                if validator.contact != row["description"].get("security_contact"):
                    updated_fields["contact"] = row["description"].get(
                        "security_contact"
                    )
                if validator.details != row["description"].get("details"):
                    updated_fields["details"] = row["description"].get("details")
                if validator.status != row["status"]:
                    updated_fields["status"] = row["status"]

                if updated_fields:
                    validators_to_update.append((validator, updated_fields))

            else:
                # Create Validator if not exists
                BlockchainValidator.objects.create(
                    blockchain=blockchain,
                    operator_address=row["operator_address"],
                    pubkey_type=row["consensus_pubkey"]["type"],
                    pubkey_key=row["consensus_pubkey"]["key"],
                    moniker=row["description"].get("moniker"),
                    jailed=row["jailed"],
                    identity=row["description"].get("identity"),
                    website=row["description"].get("website"),
                    contact=row["description"].get("security_contact"),
                    details=row["description"].get("details"),
                    status=row["status"],
                )

        # Update Validators
        print("validators_to_update: ", validators_to_update)
        if validators_to_update:
            with transaction.atomic():
                for validator, updated_fields in validators_to_update:
                    BlockchainValidator.objects.filter(id=validator.id).update(
                        **updated_fields
                    )

        return response.Response(
            {
                "rpc-data": results[0],
                "validators-data": results[1],
                "infos-data": results[2],
            },
            status=status.HTTP_200_OK,
        )
