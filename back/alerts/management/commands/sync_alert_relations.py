import time

from django.core.management.base import BaseCommand

from alerts.models import (
    UserAlertSettingVotingPower,
    UserAlertSettingUptime,
    UserAlertSettingComission,
    UserAlertSettingJailedStatus,
    UserAlertSettingTombstonedStatus,
    UserAlertSettingBondedStatus,
    UserAlertSettingOtelUpdate,
    UserAlertSettingSyncStatus,
)


class Command(BaseCommand):
    def handle(self, *args, **options):
        start_run_time = time.time()

        for user_setting in UserAlertSettingVotingPower.objects.all():
            for sms in user_setting.setting.alert_setting_voting_power_sms.filter(
                validator__isnull=True
            ):
                sms.validator = user_setting.blockchain_validator
                sms.save()
            for voice in user_setting.setting.alert_setting_voting_power_voice.filter(
                validator__isnull=True
            ):
                voice.validator = user_setting.blockchain_validator
                voice.save()

        for user_setting in UserAlertSettingUptime.objects.all():
            for sms in user_setting.setting.alert_setting_uptime_sms.filter(
                validator__isnull=True
            ):
                sms.validator = user_setting.blockchain_validator
                sms.save()
            for voice in user_setting.setting.alert_setting_uptime_voice.filter(
                validator__isnull=True
            ):
                voice.validator = user_setting.blockchain_validator
                voice.save()

        for user_setting in UserAlertSettingComission.objects.all():
            for sms in user_setting.setting.alert_setting_comission_sms.filter(
                validator__isnull=True
            ):
                sms.validator = user_setting.blockchain_validator
                sms.save()
            for voice in user_setting.setting.alert_setting_comission_voice.filter(
                validator__isnull=True
            ):
                voice.validator = user_setting.blockchain_validator
                voice.save()

        for user_setting in UserAlertSettingJailedStatus.objects.all():
            for sms in user_setting.setting.alert_setting_jailed_status_sms.filter(
                validator__isnull=True
            ):
                sms.validator = user_setting.blockchain_validator
                sms.save()
            for voice in user_setting.setting.alert_setting_jailed_status_voice.filter(
                validator__isnull=True
            ):
                voice.validator = user_setting.blockchain_validator
                voice.save()

        for user_setting in UserAlertSettingTombstonedStatus.objects.all():
            for sms in user_setting.setting.alert_setting_tombstoned_status_sms.filter(
                validator__isnull=True
            ):
                sms.validator = user_setting.blockchain_validator
                sms.save()
            for (
                voice
            ) in user_setting.setting.alert_setting_tombstoned_status_voice.filter(
                validator__isnull=True
            ):
                voice.validator = user_setting.blockchain_validator
                voice.save()

        for user_setting in UserAlertSettingBondedStatus.objects.all():
            for sms in user_setting.setting.alert_setting_bonded_sms.filter(
                validator__isnull=True
            ):
                sms.validator = user_setting.blockchain_validator
                sms.save()
            for voice in user_setting.setting.alert_setting_bonded_voice.filter(
                validator__isnull=True
            ):
                voice.validator = user_setting.blockchain_validator
                voice.save()

        for user_setting in UserAlertSettingOtelUpdate.objects.all():
            for sms in user_setting.setting.alert_setting_otel_update_sms.filter(
                bridge__isnull=True
            ):
                sms.bridge = user_setting.blockchain_validator
                sms.save()
            for voice in user_setting.setting.alert_setting_otel_update_voice.filter(
                bridge__isnull=True
            ):
                voice.bridge = user_setting.blockchain_validator
                voice.save()

        for user_setting in UserAlertSettingSyncStatus.objects.all():
            for sms in user_setting.setting.alert_setting_sync_status_sms.filter(
                bridge__isnull=True
            ):
                sms.bridge = user_setting.blockchain_validator
                sms.save()
            for voice in user_setting.setting.alert_setting_sync_status_voice.filter(
                bridge__isnull=True
            ):
                voice.bridge = user_setting.blockchain_validator
                voice.save()

        print(f"{__name__} is Finished: {(time.time() - start_run_time)}")
