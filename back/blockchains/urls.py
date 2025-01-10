from django.urls import path

from blockchains.views import BlockchainMetrics


urlpatterns = [
    path("metrics/", BlockchainMetrics.as_view()),
]
