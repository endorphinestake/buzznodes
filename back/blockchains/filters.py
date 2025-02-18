import django_filters
from django.utils.timezone import now, timedelta

from blockchains.models import BlockchainValidator, BlockchainBridge


class BlockchainValidatorFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(
        field_name="status",
        choices=BlockchainValidator.Status.choices,
        lookup_expr="exact",
    )

    class Meta:
        model = BlockchainValidator
        fields = ("status",)


class BlockchainBridgeFilter(django_filters.FilterSet):
    status = django_filters.BooleanFilter(method="filter_status")

    class Meta:
        model = BlockchainBridge
        fields = ("status",)

    def filter_status(self, queryset, name, value):
        threshold = int((now() - timedelta(hours=10)).timestamp())
        if value:
            return queryset.filter(last_timestamp__gte=threshold)
        else:
            return queryset.filter(last_timestamp__lt=threshold)
