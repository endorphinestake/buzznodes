import time

from django.core.management.base import BaseCommand
from django.utils.timezone import now, timedelta

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
from alerts.models import AlertSettingBase

from voice.tasks import submit_voice_alert


class Command(BaseCommand):
    help = "Resend Voice via Reserded channels"

    def handle(self, *args, **options):
        print("%s is starting..." % __name__)
        start_run_time = time.time()
        one_minute_ago = now() - timedelta(minutes=1)

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

        # VoiceAlerts
        for atype, model in alert_model_map.items():
            for main_voice in model.objects.filter(
                status=VoiceBase.Status.ERROR,
                provider=VoiceBase.Provider.MAIN,
                is_resent=False,
                created__gte=one_minute_ago,
            ).order_by("-id")[:50]:
                main_voice.is_resent = True
                main_voice.save()

                job = submit_voice_alert.delay(
                    provider=VoiceBase.Provider.RESERVE1,
                    phone_number_id=main_voice.phone.id,
                    text=main_voice.sent_text,
                    atype=atype,
                    setting_id=main_voice.setting_id,
                )

        print(f"{__name__} is Finished: {(time.time() - start_run_time)}")
