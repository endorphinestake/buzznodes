from django_rq import job
from django.utils.translation import gettext_lazy as _

from users.models import UserPhone
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
from logs.models import Log


@job("submit_sms")
def submit_sms_main_provider(
    phone_number_id: int,
    sms_text: str,
    stype: SMSBase.SType,
    atype: AlertSettingBase.AlertType = None,
    setting_id: int = None,
):
    print(
        f"submit_sms_main_provider: {phone_number_id} -> {sms_text} -> {stype} -> {atype} -> {setting_id}"
    )

    try:
        phone_number = UserPhone.objects.get(pk=phone_number_id)
    except UserPhone.DoesNotExist:
        Log.error(f"UserPhone not found: {phone_number_id}")
        return

    alert_model_map = {
        AlertSettingBase.AlertType.VOTING_POWER: SMSAlertVotingPower,
        AlertSettingBase.AlertType.UPTIME: SMSAlertUptime,
        AlertSettingBase.AlertType.COMISSION: SMSAlertComission,
        AlertSettingBase.AlertType.JAILED: SMSAlertJailedStatus,
        AlertSettingBase.AlertType.TOMBSTONED: SMSAlertTombstonedStatus,
        AlertSettingBase.AlertType.BONDED: SMSAlertBondedStatus,
    }

    sms_instance = None
    if stype == SMSBase.SType.ALERT:
        model_class = alert_model_map.get(atype)
        if model_class:
            sms_instance = model_class.objects.create(
                user=phone_number.user,
                phone=phone_number,
                sent_text=sms_text,
                setting_id=setting_id,
            )
        else:
            Log.error(f"Unknown AlertType: {atype}")
            return

    # TODO: Submit SMS and update sms_id & status
