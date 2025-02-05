from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from alerts.models import (
    AlertSettingBase,
    AlertSettingVotingPower,
    AlertSettingUptime,
    AlertSettingComission,
    AlertSettingJailedStatus,
    AlertSettingTombstonedStatus,
    UserAlertSettingVotingPower,
    UserAlertSettingUptime,
    UserAlertSettingComission,
    UserAlertSettingJailedStatus,
    UserAlertSettingTombstonedStatus,
)
from blockchains.models import BlockchainValidator


class AlertSettingVotingPowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingVotingPower
        fields = (
            "id",
            "channels",
            "alert_type",
            "value_from",
            "value_to",
        )


class AlertSettingUptimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingUptime
        fields = (
            "id",
            "channels",
            "alert_type",
            "value_from",
            "value_to",
        )


class AlertSettingComissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingComission
        fields = (
            "id",
            "channels",
            "alert_type",
            "value_from",
            "value_to",
        )


class AlertSettingJailedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingJailedStatus
        fields = (
            "id",
            "channels",
            "alert_type",
            "false_to_true",
            "true_to_false",
        )


class AlertSettingTombstonedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingTombstonedStatus
        fields = (
            "id",
            "channels",
            "alert_type",
            "false_to_true",
        )


class UserAlertSettingVotingPowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingVotingPower
        fields = (
            "id",
            "user_id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class UserAlertSettingUptimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingUptime
        fields = (
            "id",
            "user_id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class UserAlertSettingComissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingComission
        fields = (
            "id",
            "user_id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class UserAlertSettingJailedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingJailedStatus
        fields = (
            "id",
            "user_id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class UserAlertSettingTombstonedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingTombstonedStatus
        fields = (
            "id",
            "user_id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class CreateUserAlertSettingSerializer(serializers.Serializer):
    blockchain_validator_id = serializers.PrimaryKeyRelatedField(
        queryset=BlockchainValidator.objects.all()
    )
    setting_id = serializers.IntegerField(required=True)
    channel = serializers.ChoiceField(AlertSettingBase.AlertType.choices, required=True)

    def validate_setting_id(self, setting_id):
        channel = self.initial_data.get("channel")
        setting_models = [
            AlertSettingVotingPower,
            AlertSettingUptime,
            AlertSettingComission,
            AlertSettingJailedStatus,
            AlertSettingTombstonedStatus,
        ]

        setting_instance = None
        for model in setting_models:
            try:
                setting_instance = model.objects.get(pk=setting_id)
                break
            except model.DoesNotExist:
                continue

        if not setting_instance:
            raise serializers.ValidationError(_("Unknown setting type."))

        if channel not in setting_instance.channels:
            raise serializers.ValidationError(
                _("The alert channel is not available for this setting.")
            )

        self.context["setting"] = setting_instance
        return setting_id

    def create(self, validated_data: dict):
        blockchain_validator = BlockchainValidator.objects.get(
            id=validated_data["blockchain_validator_id"]
        )
        setting_instance = self.context["setting"]

        if isinstance(setting_instance, AlertSettingVotingPower):
            return UserAlertSettingVotingPower.objects.create(
                user=self.context["request"].user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.voting_power,
            )
        elif isinstance(setting_instance, AlertSettingUptime):
            return UserAlertSettingUptime.objects.create(
                user=self.context["request"].user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.uptime,
            )
        elif isinstance(setting_instance, AlertSettingComission):
            return UserAlertSettingComission.objects.create(
                user=self.context["request"].user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.commision_rate,
            )
        elif isinstance(setting_instance, AlertSettingJailedStatus):
            return UserAlertSettingJailedStatus.objects.create(
                user=self.context["request"].user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.jailed,
            )
        elif isinstance(setting_instance, AlertSettingTombstonedStatus):
            return UserAlertSettingTombstonedStatus.objects.create(
                user=self.context["request"].user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.tombstoned,
            )
        else:
            raise serializers.ValidationError(_("Unknown setting type."))
