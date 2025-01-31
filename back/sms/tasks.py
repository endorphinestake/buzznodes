from django_rq import job

from django.utils.translation import gettext_lazy as _


@job("submit_sms")
def submit_sms_main_provider(phone_number: int, sms_text: str):
    print(f"submit_sms_main_provider: {phone_number} -> {sms_text}")
