from django_rq import job
from django.utils.translation import gettext_lazy as _

from alerts.models import AlertSettingBase
from sms.models import (
    SMSBase,
    SMSAlertVotingPower,
    SMSAlertUptime,
    SMSAlertComission,
    SMSAlertJailedStatus,
    SMSAlertTombstonedStatus,
    SMSAlertBondedStatus,
    SMSConfirm,
)


@job("submit_sms")
def submit_sms_main_provider(
    phone_number: str,
    sms_text: str,
    stype: SMSBase.SType,
    atype: AlertSettingBase.AlertType = None,
    setting_id: int = None,
):
    print(
        f"submit_sms_main_provider: {phone_number} -> {sms_text} -> {stype} -> {atype} -> {setting_id}"
    )

    if stype == SMSBase.SType.ALERT:
        pass
