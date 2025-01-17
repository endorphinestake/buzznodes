from django.urls import path

from blockchains.views import BlockchainMetricsView, BlockchainValidatorsView


urlpatterns = [
    path("metrics/", BlockchainMetricsView.as_view()),
    path("list/", BlockchainValidatorsView.as_view()),
]
