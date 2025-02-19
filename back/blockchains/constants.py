from django.utils.timezone import timedelta

from blockchains.models import Blockchain


CHART_PERIODS = {
    Blockchain.ChartPeriod.H1: {
        "delta": timedelta(hours=1),
        "step": "25s",
    },
    Blockchain.ChartPeriod.H24: {
        "delta": timedelta(hours=24),
        "step": "10m",
    },
    Blockchain.ChartPeriod.D7: {
        "delta": timedelta(days=7),
        "step": "1h",
    },
    Blockchain.ChartPeriod.D30: {
        "delta": timedelta(days=30),
        "step": "4h",
    },
}
