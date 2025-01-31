from django_rq import job

from django.utils.translation import gettext_lazy as _


@job("submit_voice")
def submit_voice_main_provider(phone_number: int, sms_text: str):
    print(f"submit_voice_main_provider: {phone_number} -> {sms_text}")


@job("submit_voice")
def submit_voice_reserve1_provider(phone_number: int, sms_text: str):
    print(f"submit_voice_reserve1_provider: {phone_number} -> {sms_text}")
