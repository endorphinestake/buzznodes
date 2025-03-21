from rest_framework import serializers

from sms.models import (
    SMSAlertVotingPower,
    SMSAlertUptime,
    SMSAlertComission,
    SMSAlertJailedStatus,
    SMSAlertTombstonedStatus,
    SMSAlertBondedStatus,
    SMSAlertOtelUpdate,
    SMSAlertSyncStatus,
)
from alerts.utils import clean_tags_from_text


class SMSAlertBaseSerializer(serializers.ModelSerializer):
    message = serializers.SerializerMethodField()
    user_phone = serializers.SerializerMethodField()

    def get_message(self, obj):
        return clean_tags_from_text(obj.sent_text)

    def get_user_phone(self, obj):
        if obj.phone:
            return obj.phone.phone
        return None

    class Meta:
        fields = (
            "id",
            "setting_id",
            "message",
            "user_phone",
            "status",
            "created",
        )


class SMSAlertVotingPowerSerializer(SMSAlertBaseSerializer):
    class Meta(SMSAlertBaseSerializer.Meta):
        model = SMSAlertVotingPower


class SMSAlertUptimeSerializer(SMSAlertBaseSerializer):
    class Meta(SMSAlertBaseSerializer.Meta):
        model = SMSAlertUptime


class SMSAlertComissionSerializer(SMSAlertBaseSerializer):
    class Meta(SMSAlertBaseSerializer.Meta):
        model = SMSAlertComission


class SMSAlertJailedStatusSerializer(SMSAlertBaseSerializer):
    class Meta(SMSAlertBaseSerializer.Meta):
        model = SMSAlertJailedStatus


class SMSAlertTombstonedStatusSerializer(SMSAlertBaseSerializer):
    class Meta(SMSAlertBaseSerializer.Meta):
        model = SMSAlertTombstonedStatus


class SMSAlertBondedStatusSerializer(SMSAlertBaseSerializer):
    class Meta(SMSAlertBaseSerializer.Meta):
        model = SMSAlertBondedStatus


class SMSAlertOtelUpdateSerializer(SMSAlertBaseSerializer):
    class Meta(SMSAlertBaseSerializer.Meta):
        model = SMSAlertOtelUpdate


class SMSAlertSyncStatusSerializer(SMSAlertBaseSerializer):
    class Meta(SMSAlertBaseSerializer.Meta):
        model = SMSAlertSyncStatus
