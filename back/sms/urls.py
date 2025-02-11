from django.urls import path

from sms.views import WebhookHicellView

urlpatterns = [
    path("webhook/hicell/", WebhookHicellView.as_view()),
]
