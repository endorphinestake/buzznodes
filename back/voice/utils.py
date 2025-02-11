from voice.models import (
    VoiceBase,
    VoiceAlertVotingPower,
    VoiceAlertUptime,
    VoiceAlertComission,
    VoiceAlertJailedStatus,
    VoiceAlertTombstonedStatus,
    VoiceAlertBondedStatus,
)


def find_voice_by_id(voice_id):
    for model in [
        VoiceAlertVotingPower,
        VoiceAlertUptime,
        VoiceAlertComission,
        VoiceAlertJailedStatus,
        VoiceAlertTombstonedStatus,
        VoiceAlertBondedStatus,
    ]:
        voice = model.objects.filter(
            voice_id=voice_id,
            status__in=[
                VoiceBase.Status.SENT,
                VoiceBase.Status.STARTING,
                VoiceBase.Status.RINGING,
                VoiceBase.Status.ONGOING,
            ],
        ).last()
        if voice:
            return voice
    return None
