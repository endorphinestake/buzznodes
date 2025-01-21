from rest_framework import serializers

from blockchains.models import BlockchainValidator


class BlockchainValidatorModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockchainValidator
        fields = (
            "id",
            "blockchain_id",
            "operator_address",
            "moniker",
            "picture",
            "voting_power",
            "commision_rate",
            "uptime",
            "status",
            "updated",
        )


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


class RpcPubKeySerializer(serializers.Serializer):
    type = serializers.CharField()
    value = serializers.CharField()


class RpcValidatorSerializer(serializers.Serializer):
    address = serializers.CharField()
    pub_key = RpcPubKeySerializer()
    voting_power = serializers.IntegerField()
    proposer_priority = serializers.IntegerField()


class InfosValidatorSerializer(serializers.Serializer):
    address = serializers.CharField()
    start_height = serializers.IntegerField()
    index_offset = serializers.IntegerField()
    jailed_until = serializers.DateTimeField()
    tombstoned = serializers.BooleanField()
    missed_blocks_counter = serializers.IntegerField()


class PrimaryPictureSerializer(serializers.Serializer):
    url = serializers.URLField()
    source = serializers.CharField(allow_null=True, required=False)


class PicturesSerializer(serializers.Serializer):
    primary = PrimaryPictureSerializer()


class ValidatorPictureSerializer(serializers.Serializer):
    id = serializers.CharField()
    pictures = PicturesSerializer()
