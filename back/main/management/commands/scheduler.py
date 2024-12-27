from django.core.management.base import BaseCommand
from django.core.management import call_command
from apscheduler.schedulers.asyncio import AsyncIOScheduler


import asyncio


def autoremove_logs():
    call_command("autoremove_logs")


class Command(BaseCommand):
    help = "Scheduler Tasks"

    def handle(self, *args, **options):
        loop = asyncio.get_event_loop()

        scheduler = AsyncIOScheduler(event_loop=loop)

        scheduler.add_job(autoremove_logs, "cron", hour="*/12")

        scheduler.start()

        self.stdout.write("Scheduler started. Press Ctrl+C to stop.")

        try:
            loop.run_forever()
        except (KeyboardInterrupt, SystemExit):
            self.stdout.write("Scheduler stopped.")
        finally:
            scheduler.shutdown(wait=False)
            loop.close()
