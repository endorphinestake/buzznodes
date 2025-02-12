from rest_framework import views, permissions, response, status

from voice.models import VoiceBase
from voice.utils import find_voice_by_id


class WebhookVoiceUnitalkView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        print("WebhookVoiceUnitalkView POST:", request.POST)
        print("WebhookVoiceUnitalkView DATA:", request.data)

        voice_id = request.data.get("call", {}).get("meta", None)
        voice_event = request.data.get("event")
        voice_state = request.data.get("call", {}).get("state", None)
        if not voice_id:
            return response.Response(
                "Voice Meta not found!", status=status.HTTP_400_BAD_REQUEST
            )

        voice_instance = find_voice_by_id(int(voice_id))
        if voice_instance:
            events = {
                "CALL_NEW": VoiceBase.Status.STARTING,
                "CALL_REDIRECT": VoiceBase.Status.STARTING,
                "CALL_ANSWER": VoiceBase.Status.ONGOING,
                "CALL_END": VoiceBase.Status.COMPLETED,
            }

            states = {
                "ANSWER": VoiceBase.Status.COMPLETED,  # Звонок был принят
                "BUSY": VoiceBase.Status.BUSY,  # Линия была занята
                "FAIL": VoiceBase.Status.ERROR,  # Сбой
                "NOANSWER": VoiceBase.Status.NO_ANSWER,  # Звонок не был принят
                "CHANUNAVAIL": VoiceBase.Status.BUSY,  # Вызываемый номер был недоступен
                "NOMONEY": VoiceBase.Status.ERROR,  # Недостаточно средств для совершения звонка
                "BUSYOUT": VoiceBase.Status.ERROR,  # Во время совершения звонка все внешние линии были заняты
                "WRONGDIR": VoiceBase.Status.ERROR,  # Неверное направление звонка
                "BLOCKED": VoiceBase.Status.ERROR,  # Звонок был заблокирован согласно настройкам проекта
                "DIALING": VoiceBase.Status.ONGOING,  # Идет вызов
                "UNREACHABLE": VoiceBase.Status.ERROR,  # Абонент недоступен или находится вне зоны действия сети
                "NOT_EXIST": VoiceBase.Status.ERROR,  # Вызываемый номер не существует
            }

            print("VOICE_EVENT: ", voice_event)
            print("VOICE_STATE: ", voice_state)

            event = events.get(voice_event)
            state = states.get(voice_state)

            if state or event:
                voice_instance.status = state or event
                voice_instance.save()

        return response.Response("OK", status=status.HTTP_200_OK)


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
