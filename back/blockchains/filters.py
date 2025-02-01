import django_filters

from blockchains.models import BlockchainValidator


class BlockchainValidatorFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(
        field_name="status",
        choices=BlockchainValidator.Status.choices,
        lookup_expr="exact",
    )

    class Meta:
        model = BlockchainValidator
        fields = ("status",)
