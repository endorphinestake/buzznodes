from django.urls import path


from blockchains.views import (
    CosmosBlockchainMetricsView,
    BlockchainValidatorsView,
    BlockchainChartView,
)

urlpatterns = [
    path("metrics/<int:blockchain_id>/", CosmosBlockchainMetricsView.as_view()),
    path("list/", BlockchainValidatorsView.as_view()),
    path("charts/", BlockchainChartView.as_view()),
]
