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
    SMSAlertOtelUpdate,
    SMSAlertSyncStatus,
    SMSConfirm,
)
from sms.providers.hicell.utils import hicell_submit_sms  # SMS Main channel
from sms.providers.bird.utils import bird_submit_sms  # SMS Reserve1 channel
from logs.models import Log
from alerts.utils import clean_tags_from_text


@job("submit_sms")
def submit_sms_confirm(
    provider: SMSBase.Provider,
    phone_number_id: int,
    text: str,
    code: str,
):
    print(f"submit_sms_confirm: {provider} -> {phone_number_id} -> {text} -> {code}")

    try:
        phone_number = UserPhone.objects.get(pk=phone_number_id)
    except UserPhone.DoesNotExist:
        Log.error(f"UserPhone not found: {phone_number_id}")
        return

    sms_instance = SMSConfirm.objects.create(
        user=phone_number.user,
        phone=phone_number,
        sent_text=text,
        provider=provider,
        code=code,
        expire_code=now() + settings.PHONE_NUMBER_CODE_EXPIRED,
    )

    if provider == SMSBase.Provider.MAIN:
        err, sms_id = hicell_submit_sms(phone=phone_number.phone, text=text)
    elif provider == SMSBase.Provider.RESERVE1:
        err, sms_id = bird_submit_sms(phone=phone_number.phone, text=text)
    else:
        err, sms_id = f"Unknown SMS provider: {provider}", None

    if err is None:
        sms_instance.sms_id = sms_id
        sms_instance.status = SMSBase.Status.SENT
        sms_instance.save()
    else:
        sms_instance.err = err
        sms_instance.status = SMSBase.Status.ERROR
        sms_instance.save()


@job("submit_sms")
def submit_sms_alert(
    provider: SMSBase.Provider,
    phone_number_id: int,
    text: str,
    atype: AlertSettingBase.AlertType,
    setting_id: int = None,
    validator_id: int = None,
    bridge_id: int = None,
):
    print(
        f"submit_sms_alert: {provider} -> {phone_number_id} -> {text} -> {atype} -> {setting_id} -> {validator_id} -> {bridge_id}"
    )

    text = clean_tags_from_text(text)

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
        AlertSettingBase.AlertType.OTEL_UPDATE: SMSAlertOtelUpdate,
        AlertSettingBase.AlertType.SYNC_STATUS: SMSAlertSyncStatus,
    }

    model_class = alert_model_map.get(atype)
    if not model_class:
        Log.error(f"Unknown AlertType: {atype}")
        return

    sms_instance = model_class.objects.create(
        user=phone_number.user,
        phone=phone_number,
        sent_text=text,
        provider=provider,
        setting_id=setting_id,
        validator_id=validator_id,
        bridge_id=bridge_id,
    )

    if provider == SMSBase.Provider.MAIN:
        err, sms_id = hicell_submit_sms(phone=phone_number.phone, text=text)
    elif provider == SMSBase.Provider.RESERVE1:
        err, sms_id = bird_submit_sms(phone=phone_number.phone, text=text)
    else:
        err, sms_id = f"Unknown SMS provider: {provider}", None

    if err is None:
        sms_instance.sms_id = sms_id
        sms_instance.status = SMSBase.Status.SENT
        sms_instance.save()
    else:
        sms_instance.err = err
        sms_instance.status = SMSBase.Status.ERROR
        sms_instance.save()
