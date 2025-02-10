from django_rq import job
from django.utils.translation import gettext_lazy as _

from sms.models import SMSBase


@job("submit_sms")
def submit_sms_main_provider(
    phone_number: str,
    sms_text: str,
    stype: SMSBase.SType,
    setting_id: int = None,
):
    print(
        f"submit_sms_main_provider: {phone_number} -> {sms_text} -> {stype} -> {setting_id}"
    )
