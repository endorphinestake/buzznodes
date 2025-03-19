from django.utils.timezone import timedelta

from blockchains.models import Blockchain


CHART_PERIODS = {
    Blockchain.ChartPeriod.H1: {
        "delta": timedelta(hours=1),
        "step": Blockchain.ChartStep.S25,
    },
    Blockchain.ChartPeriod.H24: {
        "delta": timedelta(hours=24),
        "step": Blockchain.ChartStep.M10,
    },
    Blockchain.ChartPeriod.D7: {
        "delta": timedelta(days=7),
        "step": Blockchain.ChartStep.H1,
    },
    Blockchain.ChartPeriod.D30: {
        "delta": timedelta(days=30),
        "step": Blockchain.ChartStep.H4,
    },
}
