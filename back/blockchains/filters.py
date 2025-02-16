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
    is_active = django_filters.BooleanFilter(method="filter_is_active")

    class Meta:
        model = BlockchainBridge
        fields = ("is_active",)

    def filter_is_active(self, queryset, name, value):
        threshold = int((now() - timedelta(hours=10)).timestamp() * 1000)
        if value:
            return queryset.filter(last_timestamp__gte=threshold)
        else:
            return queryset.filter(last_timestamp__lt=threshold)
