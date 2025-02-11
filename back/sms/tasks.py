from django_rq import job
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now

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
from sms.providers.hicell.utils import hicell_submit_sms
from sms.providers.bird.utils import bird_submit_sms
from logs.models import Log


@job("submit_sms")
def submit_sms_confirm_main_provider(
    phone_number_id: int,
    text: str,
    code: str,
):
    print(f"submit_sms_confirm_main_provider: {phone_number_id} -> {text} -> {code}")

    try:
        phone_number = UserPhone.objects.get(pk=phone_number_id)
    except UserPhone.DoesNotExist:
        Log.error(f"UserPhone not found: {phone_number_id}")
        return

    sms_instance = SMSConfirm.objects.create(
        user=phone_number.user,
        phone=phone_number,
        sent_text=text,
        provider=SMSBase.Provider.MAIN,
        code=code,
        expire_code=now() + settings.PHONE_NUMBER_CODE_EXPIRED,
        is_used=False,
    )

    err, sms_id = hicell_submit_sms(phone=phone_number.phone, text=text)
    if err is None:
        sms_instance.sms_id = sms_id
        sms_instance.status = SMSBase.Status.SENT
        sms_instance.save()
    else:
        sms_instance.err = err
        sms_instance.status = SMSBase.Status.ERROR
        sms_instance.save()


@job("submit_sms")
def submit_sms_alert_main_provider(
    phone_number_id: int,
    text: str,
    atype: AlertSettingBase.AlertType,
    setting_id: int = None,
):
    print(
        f"submit_sms_alert_main_provider: {phone_number_id} -> {text} -> {atype} -> {setting_id}"
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

    model_class = alert_model_map.get(atype)
    if not model_class:
        Log.error(f"Unknown AlertType: {atype}")
        return

    sms_instance = model_class.objects.create(
        user=phone_number.user,
        phone=phone_number,
        sent_text=text,
        provider=SMSBase.Provider.MAIN,
        setting_id=setting_id,
    )

    err, sms_id = hicell_submit_sms(phone=phone_number.phone, text=text)
    if err is None:
        sms_instance.sms_id = sms_id
        sms_instance.status = SMSBase.Status.SENT
        sms_instance.save()
    else:
        sms_instance.err = err
        sms_instance.status = SMSBase.Status.ERROR
        sms_instance.save()
