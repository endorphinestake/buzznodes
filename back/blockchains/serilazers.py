from django.conf import settings
from django.utils.timezone import now, timedelta

from rest_framework import serializers

from blockchains.models import Blockchain, BlockchainValidator, BlockchainBridge


class BlockchainValidatorModelSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["commision_rate"] = float(representation["commision_rate"])
        representation["uptime"] = float(representation["uptime"])

        return representation

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
            "tombstoned",
            "uptime",
            "status",
            "updated",
        )


class BlockchainBridgeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockchainBridge
        fields = (
            "id",
            "blockchain_id",
            "node_id",
            "version",
            "system_version",
            "node_height",
            "node_height_diff",
            "last_timestamp",
            "last_timestamp_diff",
        )


class BlockchainValidatorDetailModelSerializer(BlockchainValidatorModelSerializer):
    class Meta:
        model = BlockchainValidator
        fields = BlockchainValidatorModelSerializer.Meta.fields + (
            "pubkey_type",
            "pubkey_key",
            "identity",
            "website",
            "contact",
            "details",
            "commision_max_rate",
            "commision_max_change_rate",
            "missed_blocks_counter",
            "hex_address",
            "valcons_address",
            "wallet_address",
            "jailed",
            "tombstoned",
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


class ValidatorChartsSerializer(serializers.Serializer):
    validator_ids = serializers.ListField(
        child=serializers.IntegerField(), required=True, max_length=5
    )
    period = serializers.ChoiceField(choices=Blockchain.ChartPeriod.choices)
    date_start = serializers.DateTimeField(required=False)
    date_end = serializers.DateTimeField(required=False)

    def validate_date_start(self, value):
        if value and value < now() - timedelta(days=30):
            raise serializers.ValidationError(
                "Start date cannot be older than 30 days."
            )
        return value

    def validate_date_end(self, value):
        date_start = self.initial_data.get("date_start")
        if value and date_start:
            if value < date_start:
                raise serializers.ValidationError(
                    "End date cannot be earlier than start date."
                )
            if value > date_start + settings.METRICS_CHART_MAX_PERIOD:
                raise serializers.ValidationError(
                    "End date cannot be more than 1 hour after start date."
                )
        return value


class GrafanaChartMetricSerializer(serializers.Serializer):
    __name__ = serializers.CharField(required=True)
    moniker = serializers.CharField(required=True)
    validator_id = serializers.IntegerField(required=True)


class GrafanaChartSerializer(serializers.Serializer):
    metric = GrafanaChartMetricSerializer()
    values = serializers.ListField(
        child=serializers.ListField(child=serializers.CharField())
    )
