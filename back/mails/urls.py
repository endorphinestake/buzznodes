from django.urls import path

from mails.views import ContactFormView


urlpatterns = [
    path("contact/", ContactFormView.as_view()),
]
