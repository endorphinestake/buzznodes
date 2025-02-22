from voice.models import (
    VoiceBase,
    VoicePhoneTest,
    VoiceAlertVotingPower,
    VoiceAlertUptime,
    VoiceAlertComission,
    VoiceAlertJailedStatus,
    VoiceAlertTombstonedStatus,
    VoiceAlertBondedStatus,
    VoiceAlertOtelUpdate,
    VoiceAlertSyncStatus,
)


def find_voice_by_id(voice_id):
    for model in [
        VoiceAlertOtelUpdate,
        VoiceAlertSyncStatus,
        VoiceAlertUptime,
        VoiceAlertVotingPower,
        VoiceAlertComission,
        VoiceAlertBondedStatus,
        VoiceAlertJailedStatus,
        VoiceAlertTombstonedStatus,
        VoicePhoneTest,
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
