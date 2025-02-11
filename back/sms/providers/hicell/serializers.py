from rest_framework import serializers


class HicellSMSResponseSerializer(serializers.Serializer):
    status = serializers.CharField()
    cost = serializers.CharField(required=False)
    country = serializers.CharField(required=False)
    mccmnc = serializers.CharField(required=False)
    number = serializers.CharField(required=False)
    parts = serializers.IntegerField(required=False)
    message_id = serializers.CharField(required=False)


class HicellSMSReplySerializer(serializers.Serializer):
    reply = HicellSMSResponseSerializer(many=True)


class HicellMessageStatusSerializer(serializers.Serializer):
    msgid = serializers.UUIDField()
    status = serializers.ChoiceField(
        choices=["delivrd", "unknown", "rejectd", "expired", "undeliv", "deleted"]
    )
    dlr_timestamp = serializers.DateTimeField()
