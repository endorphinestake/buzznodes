from rest_framework import serializers

from voice.models import (
    VoiceAlertVotingPower,
    VoiceAlertUptime,
    VoiceAlertComission,
    VoiceAlertJailedStatus,
    VoiceAlertTombstonedStatus,
    VoiceAlertBondedStatus,
    VoiceAlertOtelUpdate,
    VoiceAlertSyncStatus,
)
from alerts.utils import clean_tags_from_text


class VoiceAlertBaseSerializer(serializers.ModelSerializer):
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


class VoiceAlertVotingPowerSerializer(VoiceAlertBaseSerializer):
    class Meta(VoiceAlertBaseSerializer.Meta):
        model = VoiceAlertVotingPower


class VoiceAlertUptimeSerializer(VoiceAlertBaseSerializer):
    class Meta(VoiceAlertBaseSerializer.Meta):
        model = VoiceAlertUptime


class VoiceAlertComissionSerializer(VoiceAlertBaseSerializer):
    class Meta(VoiceAlertBaseSerializer.Meta):
        model = VoiceAlertComission


class VoiceAlertJailedStatusSerializer(VoiceAlertBaseSerializer):
    class Meta(VoiceAlertBaseSerializer.Meta):
        model = VoiceAlertJailedStatus


class VoiceAlertTombstonedStatusSerializer(VoiceAlertBaseSerializer):
    class Meta(VoiceAlertBaseSerializer.Meta):
        model = VoiceAlertTombstonedStatus


class VoiceAlertBondedStatusSerializer(VoiceAlertBaseSerializer):
    class Meta(VoiceAlertBaseSerializer.Meta):
        model = VoiceAlertBondedStatus


class VoiceAlertOtelUpdateSerializer(VoiceAlertBaseSerializer):
    class Meta(VoiceAlertBaseSerializer.Meta):
        model = VoiceAlertOtelUpdate


class VoiceAlertSyncStatusSerializer(VoiceAlertBaseSerializer):
    class Meta(VoiceAlertBaseSerializer.Meta):
        model = VoiceAlertSyncStatus
