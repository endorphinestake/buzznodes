from django.urls import path

from voice.views import WebhookVoiceUnitalkView, WebhookVoiceBirdView

urlpatterns = [
    path("webhook/unitalk/", WebhookVoiceUnitalkView.as_view()),
    path("webhook/bird/", WebhookVoiceBirdView.as_view()),
]
