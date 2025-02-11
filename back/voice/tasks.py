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
)
from logs.models import Log


@job("submit_voice")
def submit_voice_alert_main_provider(
    phone_number_id: int,
    text: str,
    atype: AlertSettingBase.AlertType,
    setting_id: int = None,
):
    print(
        f"submit_voice_alert_main_provider: {phone_number_id} -> {text} -> {atype} -> {setting_id}"
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

    # TODO: Submit Voice and update voice_id & status
