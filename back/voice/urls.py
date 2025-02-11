from django.urls import path

from voice.views import WebhookVoiceBirdView

urlpatterns = [
    path("webhook/bird/", WebhookVoiceBirdView.as_view()),
]
