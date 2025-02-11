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
)

from sms.tasks import submit_sms_confirm, submit_sms_alert


class Command(BaseCommand):
    help = "Resend SMS via Reserded channels"

    def handle(self, *args, **options):
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

        print(f"{__name__} is Finished: {(time.time() - start_run_time)}")
