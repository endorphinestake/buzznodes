from django_rq import job
from django.utils.translation import gettext_lazy as _

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


@job("submit_voice")
def submit_voice_main_provider(
    phone_number: str,
    voice_text: str,
    vtype: VoiceBase.VType,
    atype: AlertSettingBase.AlertType = None,
    setting_id: int = None,
):
    print(
        f"submit_voice_main_provider: {phone_number} -> {voice_text} -> {vtype} -> {atype} -> {setting_id}"
    )
