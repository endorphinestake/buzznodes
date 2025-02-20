from django_rq import job
from django.utils.translation import gettext_lazy as _

from users.models import UserPhone
from alerts.models import AlertSettingBase
from voice.models import (
    VoiceBase,
    VoiceAlertVotingPower,
    VoiceAlertUptime,
    VoiceAlertComission,
    VoiceAlertJailedStatus,
    VoiceAlertTombstonedStatus,
    VoiceAlertBondedStatus,
    VoiceAlertOtelUpdate,
    VoiceAlertSyncStatus,
)
from logs.models import Log
from voice.providers.unitalk.utils import unitalk_submit_voice
from voice.providers.bird.utils import bird_submit_voice


@job("submit_voice")
def submit_voice_alert(
    provider: VoiceBase.Provider,
    phone_number_id: int,
    text: str,
    atype: AlertSettingBase.AlertType,
    setting_id: int = None,
):

    print(
        f"submit_voice_alert: {provider} -> {phone_number_id} -> {text} -> {atype} -> {setting_id}"
    )

    try:
        phone_number = UserPhone.objects.get(pk=phone_number_id)
    except UserPhone.DoesNotExist:
        Log.error(f"UserPhone not found: {phone_number_id}")
        return

    alert_model_map = {
        AlertSettingBase.AlertType.VOTING_POWER: VoiceAlertVotingPower,
        AlertSettingBase.AlertType.UPTIME: VoiceAlertUptime,
        AlertSettingBase.AlertType.COMISSION: VoiceAlertComission,
        AlertSettingBase.AlertType.JAILED: VoiceAlertJailedStatus,
        AlertSettingBase.AlertType.TOMBSTONED: VoiceAlertTombstonedStatus,
        AlertSettingBase.AlertType.BONDED: VoiceAlertBondedStatus,
        AlertSettingBase.AlertType.OTEL_UPDATE: VoiceAlertOtelUpdate,
        AlertSettingBase.AlertType.SYNC_STATUS: VoiceAlertSyncStatus,
    }

    model_class = alert_model_map.get(atype)
    if not model_class:
        Log.error(f"Unknown AlertType: {atype}")
        return

    voice_instance = model_class.objects.create(
        user=phone_number.user,
        phone=phone_number,
        sent_text=text,
        provider=VoiceBase.Provider.MAIN,
        setting_id=setting_id,
    )

    if provider == VoiceBase.Provider.MAIN:
        err, voice_id = unitalk_submit_voice(
            phone=phone_number.phone, text=text, voice_id=voice_instance.id
        )
    elif provider == VoiceBase.Provider.RESERVE1:
        err, voice_id = bird_submit_voice(phone=phone_number.phone, text=text)
    else:
        err, voice_id = f"Unknown Voice provider: {provider}", None

    if err is None:
        voice_instance.voice_id = voice_id
        voice_instance.status = VoiceBase.Status.SENT
        voice_instance.save()
    else:
        voice_instance.err = err
        voice_instance.status = VoiceBase.Status.ERROR
        voice_instance.save()
