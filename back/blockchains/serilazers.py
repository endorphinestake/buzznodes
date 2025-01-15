from rest_framework import serializers

from blockchains.models import BlockchainValidator


class ConsensusPubKeySerializer(serializers.Serializer):
    key = serializers.CharField()
    type = serializers.CharField()

    def to_internal_value(self, data):
        if "@type" in data:
            data["type"] = data.pop("@type")
        return super().to_internal_value(data)


class DescriptionSerializer(serializers.Serializer):
    moniker = serializers.CharField(allow_blank=True, required=False)
    identity = serializers.CharField(allow_blank=True, required=False)
    website = serializers.CharField(allow_blank=True, required=False)
    security_contact = serializers.CharField(allow_blank=True, required=False)
    details = serializers.CharField(allow_blank=True, required=False)


class CommissionRatesSerializer(serializers.Serializer):
    rate = serializers.DecimalField(max_digits=20, decimal_places=18)
    max_rate = serializers.DecimalField(max_digits=20, decimal_places=18)
    max_change_rate = serializers.DecimalField(max_digits=20, decimal_places=18)


class CommissionSerializer(serializers.Serializer):
    commission_rates = CommissionRatesSerializer()
    update_time = serializers.DateTimeField()


class BlockchainValidatorSerializer(serializers.Serializer):
    operator_address = serializers.CharField()
    consensus_pubkey = ConsensusPubKeySerializer()
    jailed = serializers.BooleanField()
    status = serializers.ChoiceField(choices=BlockchainValidator.Status.choices)
    tokens = serializers.IntegerField()
    delegator_shares = serializers.DecimalField(max_digits=50, decimal_places=18)
    description = DescriptionSerializer()
    unbonding_height = serializers.IntegerField()
    unbonding_time = serializers.DateTimeField()
    commission = CommissionSerializer()
    min_self_delegation = serializers.IntegerField()
