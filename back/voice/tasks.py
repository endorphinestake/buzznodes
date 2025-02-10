from django_rq import job
from django.utils.translation import gettext_lazy as _

from voice.models import VoiceBase


@job("submit_voice")
def submit_voice_main_provider(
    phone_number: str,
    voice_text: str,
    vtype: VoiceBase.VType,
    setting_id: int = None,
):
    print(
        f"submit_voice_main_provider: {phone_number} -> {voice_text} -> {vtype} -> {setting_id}"
    )
