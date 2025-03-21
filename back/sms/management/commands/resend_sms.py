import time

from django.core.management.base import BaseCommand
from django.utils.timezone import now, timedelta

from sms.models import (
    SMSBase,
    SMSConfirm,
    SMSAlertVotingPower,
    SMSAlertUptime,
    SMSAlertComission,
    SMSAlertJailedStatus,
    SMSAlertTombstonedStatus,
    SMSAlertBondedStatus,
    SMSAlertOtelUpdate,
    SMSAlertSyncStatus,
)
from alerts.models import AlertSettingBase

from sms.tasks import submit_sms_confirm, submit_sms_alert


class Command(BaseCommand):
    help = "Resend SMS via Reserded channels"

    def handle(self, *args, **options):
        print("%s is starting..." % __name__)
        start_run_time = time.time()
        one_minute_ago = now() - timedelta(minutes=1)

        # SMSConfirm
        for main_sms in SMSConfirm.objects.filter(
            status=SMSBase.Status.ERROR,
            provider=SMSBase.Provider.MAIN,
            is_resent=False,
            created__gte=one_minute_ago,
        ).order_by("-id")[:50]:
            main_sms.is_resent = True
            main_sms.save()

            job = submit_sms_confirm.delay(
                provider=SMSBase.Provider.RESERVE1,
                phone_number_id=main_sms.phone.id,
                text=main_sms.sent_text,
                code=main_sms.code,
            )

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

        # SMSAlerts
        for atype, model in alert_model_map.items():
            for main_sms in model.objects.filter(
                status=SMSBase.Status.ERROR,
                provider=SMSBase.Provider.MAIN,
                is_resent=False,
                created__gte=one_minute_ago,
            ).order_by("-id")[:50]:
                main_sms.is_resent = True
                main_sms.save()

                job = submit_sms_alert.delay(
                    provider=SMSBase.Provider.RESERVE1,
                    phone_number_id=main_sms.phone.id,
                    text=main_sms.sent_text,
                    atype=atype,
                    setting_id=main_sms.setting_id,
                    validator_id=main_sms.validator_id,
                    bridge_id=main_sms.bridge_id,
                )

        print(f"{__name__} is Finished: {(time.time() - start_run_time)}")
