import asyncio

from django.conf import settings
from rest_framework import views, response, status

from blockchains.models import Blockchain
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

        return response.Response(
            {
                "rpc-data": results[0],
                "validators-data": results[1],
                "infos-data": results[2],
            },
            status=status.HTTP_200_OK,
        )
