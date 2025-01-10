from rest_framework import views, response, status

from blockchains.permissions import IsPrometheusUserAgent


class BlockchainMetrics(views.APIView):
    permission_classes = (IsPrometheusUserAgent,)

    def get(self, request):
        return response.Response("OK", status=status.HTTP_200_OK)
