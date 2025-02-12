from rest_framework import views, permissions, response, status

from sms.models import SMSBase
from sms.providers.hicell.serializers import HicellMessageStatusSerializer
from sms.utils import find_sms_by_id


class WebhookSMSHicellView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        print("WebhookSMSHicellView GET:", request.GET)
        print("WebhookSMSHicellView DATA:", request.data)

        serializer = HicellMessageStatusSerializer(data=request.GET)
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        sms_instance = find_sms_by_id(serializer.validated_data["msgid"])

        if sms_instance:
            statuses = {
                "delivrd": SMSBase.Status.DELIVERED,
                "unknown": SMSBase.Status.UNDELIVRED,
                "rejectd": SMSBase.Status.REJECTED,
                "expired": SMSBase.Status.UNDELIVRED,
                "undeliv": SMSBase.Status.UNDELIVRED,
                "deleted": SMSBase.Status.REJECTED,
            }

            print("SMS_STATUS: ", serializer.validated_data["dlr_status"])
            if statuses.get(serializer.validated_data["dlr_status"]):
                sms_instance.status = statuses[serializer.validated_data["dlr_status"]]
                sms_instance.save()
        return response.Response("OK", status=status.HTTP_200_OK)


class WebhookSMSBirdView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        print("WebhookSMSBirdView POST:", request.POST)
        print("WebhookSMSBirdView DATA:", request.data)

        sms_id = request.data.get("payload", {}).get("id", None)
        sms_status = request.data.get("payload", {}).get("status", None)
        if not sms_id:
            return response.Response(
                "Message ID not found!", status=status.HTTP_400_BAD_REQUEST
            )

        sms_instance = find_sms_by_id(sms_id)
        if sms_instance:
            statuses = {
                "accepted": SMSBase.Status.SENT,
                "sent": SMSBase.Status.SENT,
                "sending_failed": SMSBase.Status.REJECTED,
                "delivered": SMSBase.Status.DELIVERED,
                "processing": SMSBase.Status.SENT,
                "delivery_failed": SMSBase.Status.UNDELIVRED,
            }

            print("SMS_STATUS: ", sms_status)
            if statuses.get(sms_status):
                sms_instance.status = statuses[sms_status]
                sms_instance.save()

        return response.Response("OK", status=status.HTTP_200_OK)
