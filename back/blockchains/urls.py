from django.urls import path

from blockchains.views import (
    CosmosBlockchainMetricsView,
    BlockchainValidatorsView,
    BlockchainChartView,
)


urlpatterns = [
    path("metrics/", CosmosBlockchainMetricsView.as_view()),
    path("list/", BlockchainValidatorsView.as_view()),
    path("chart/<int:validator_id>/", BlockchainChartView.as_view()),
]
