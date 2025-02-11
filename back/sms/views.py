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
        for model in [
            SMSConfirm,
            SMSAlertVotingPower,
            SMSAlertUptime,
            SMSAlertComission,
            SMSAlertJailedStatus,
            SMSAlertTombstonedStatus,
            SMSAlertBondedStatus,
        ]:
            sms = model.objects.filter(sms_id=sms_id, status=SMSBase.Status.SENT).last()
            if sms:
                return sms
        return None

    def get(self, request):
        print("WebhookHicellView GET:", request.GET)
        print("WebhookHicellView DATA:", request.data)

        serializer = HicellMessageStatusSerializer(data=request.GET)
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        sms_instance = self._find_sms_by_id(serializer.validated_data["msgid"])

        if sms_instance:
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
