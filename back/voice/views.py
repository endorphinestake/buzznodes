from rest_framework import views, permissions, response, status

from voice.models import VoiceBase
from voice.utils import find_voice_by_id


class WebhookVoiceBirdView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        print("WebhookVoiceBirdView POST:", request.POST)
        print("WebhookVoiceBirdView DATA:", request.data)

        voice_id = request.data.get("payload", {}).get("id", None)
        voice_status = request.data.get("payload", {}).get("status", None)
        if not voice_id:
            return response.Response(
                "Voice ID not found!", status=status.HTTP_400_BAD_REQUEST
            )

        voice_instance = find_voice_by_id(voice_id)
        if voice_instance:
            statuses = {
                "starting": VoiceBase.Status.STARTING,
                "ringing": VoiceBase.Status.RINGING,
                "ongoing": VoiceBase.Status.ONGOING,
                "completed": VoiceBase.Status.COMPLETED,
                "no-answer": VoiceBase.Status.NO_ANSWER,
                "busy": VoiceBase.Status.BUSY,
                "failed": VoiceBase.Status.ERROR,
            }

            print("VOICE_STATUS: ", voice_status)
            if statuses.get(voice_status):
                voice_instance.status = statuses[voice_status]
            voice_instance.save()

        return response.Response("OK", status=status.HTTP_200_OK)
