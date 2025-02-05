from rest_framework import serializers

from alerts.models import (
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


class AlertSettingVotingPowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingVotingPower
        fields = (
            "id",
            "channels",
            "value_from",
            "value_to",
        )


class AlertSettingUptimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingUptime
        fields = (
            "id",
            "channels",
            "value_from",
            "value_to",
        )


class AlertSettingComissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingComission
        fields = (
            "id",
            "channels",
            "value_from",
            "value_to",
        )


class AlertSettingJailedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingJailedStatus
        fields = (
            "id",
            "channels",
            "false_to_true",
            "true_to_false",
        )


class AlertSettingTombstonedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingTombstonedStatus
        fields = (
            "id",
            "channels",
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
