from django.urls import path

from sms.views import WebhookSMSHicellView, WebhookSMSBirdView

urlpatterns = [
    path("webhook/hicell/", WebhookSMSHicellView.as_view()),
    path("webhook/bird/", WebhookSMSBirdView.as_view()),
]
