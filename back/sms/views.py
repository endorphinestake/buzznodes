from functools import reduce
from rest_framework import views, permissions, response, status

from sms.models import (
    SMSBase,
    SMSConfirm,
    SMSAlertVotingPower,
    SMSAlertUptime,
    SMSAlertComission,
    SMSAlertJailedStatus,
    SMSAlertTombstonedStatus,
    SMSAlertBondedStatus,
)
from sms.providers.hicell.serializers import HicellMessageStatusSerializer


class WebhookHicellView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def _find_sms_by_id(self, sms_id):
        querysets = [
            SMSAlertVotingPower.objects.filter(sms_id=sms_id),
            SMSAlertUptime.objects.filter(sms_id=sms_id),
            SMSAlertComission.objects.filter(sms_id=sms_id),
            SMSAlertJailedStatus.objects.filter(sms_id=sms_id),
            SMSAlertTombstonedStatus.objects.filter(sms_id=sms_id),
            SMSAlertBondedStatus.objects.filter(sms_id=sms_id),
            SMSConfirm.objects.filter(sms_id=sms_id),
        ]
        return reduce(lambda qs1, qs2: qs1.union(qs2), querysets).first()

    def get(self, request):
        print("WebhookHicellView GET:", request.GET)
        print("WebhookHicellView DATA:", request.data)

        serializer = HicellMessageStatusSerializer(data=request.GET)
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        sms_instance = self._find_sms_by_id(serializer.validated_data["msgid"])

        statuses = {
            "delivrd": SMSBase.Status.DELIVERED,
            "unknown": SMSBase.Status.UNDELIVRED,
            "rejectd": SMSBase.Status.REJECTED,
            "expired": SMSBase.Status.UNDELIVRED,
            "undeliv": SMSBase.Status.UNDELIVRED,
            "deleted": SMSBase.Status.REJECTED,
        }

        sms_instance.status = statuses.get(
            serializer.validated_data["dlr_status"], SMSBase.Status.ERROR
        )
        sms_instance.save()
        return response.Response("OK", status=status.HTTP_200_OK)
