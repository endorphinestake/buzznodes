from django.urls import path


from blockchains.views import (
    CosmosBlockchainMetricsView,
    BlockchainValidatorsView,
    BlockchainValidatorView,
    BlockchainChartView,
)

urlpatterns = [
    path("metrics/<int:blockchain_id>/", CosmosBlockchainMetricsView.as_view()),
    path("list/<int:blockchain_id>/", BlockchainValidatorsView.as_view()),
    path(
        "details/<int:blockchain_id>/<int:validator_id>/",
        BlockchainValidatorView.as_view(),
    ),
    path("charts/", BlockchainChartView.as_view()),
]
