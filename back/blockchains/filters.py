import django_filters
from django.utils.timezone import now, timedelta

from blockchains.models import BlockchainValidator, BlockchainBridge


class BlockchainValidatorFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(
        field_name="status",
        choices=BlockchainValidator.Status.choices,
        method="filter_status",
    )

    class Meta:
        model = BlockchainValidator
        fields = ("status",)

    def filter_status(self, queryset, name, value):
        if value == BlockchainValidator.Status.BOND_STATUS_UNBONDED:
            return queryset.exclude(
                status=BlockchainValidator.Status.BOND_STATUS_BONDED
            )
        return queryset.filter(**{name: value})


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
