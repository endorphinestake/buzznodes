from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone

from logs.models import Log

import time


class Command(BaseCommand):
    help = "Autoremove expired Logs"

    def handle(self, *args, **options):
        print("%s is starting..." % __name__)
        start_time = time.time()
        expired_date = timezone.now() - settings.EXPIRED_LOGS_PERIOD

        expired_logs_count, _ = Log.objects.filter(created__lt=expired_date).delete()

        print(f"Deleted {expired_logs_count} expired logs.")

        print("%s is Finished: %s" % (__name__, (time.time() - start_time)))
