from decimal import Decimal, ROUND_HALF_UP
from django_rq import job
from django.utils.translation import gettext_lazy as _

from blockchains.models import BlockchainValidator
from alerts.models import (
    AlertSettingBase,
    UserAlertSettingVotingPower,
    UserAlertSettingUptime,
    UserAlertSettingComission,
    UserAlertSettingJailedStatus,
    UserAlertSettingTombstonedStatus,
    UserAlertSettingBondedStatus,
)


@job("alerts")
def check_alerts(
    validators_to_update: list[tuple[int, dict]], validators_to_update_prev: dict
):

    for validator_id, updated_fields in validators_to_update:
        # Voting Power Alerts
        if "voting_power" in updated_fields:
            for (
                user_alert_setting
            ) in UserAlertSettingVotingPower.objects.select_related("setting").filter(
                blockchain_validator_id=validator_id, setting__status=True
            ):
                # Increased Voting Power
                if user_alert_setting.setting.value > 0:
                    if int(updated_fields["voting_power"]) >= (
                        user_alert_setting.current_value
                        + user_alert_setting.setting.value
                    ):
                        user_alert_setting.current_value = int(
                            updated_fields["voting_power"]
                        )
                        user_alert_setting.save()

                        print("SUBMIT ALERT VOTING_POWER INCREASED!!!")

                # Decreased Voting Power
                else:
                    if int(updated_fields["voting_power"]) <= (
                        user_alert_setting.current_value
                        - abs(user_alert_setting.setting.value)
                    ):
                        user_alert_setting.current_value = int(
                            updated_fields["voting_power"]
                        )
                        user_alert_setting.save()

                        print("SUBMIT ALERT VOTING_POWER DECREASED!!!")

        # Uptime
        if "uptime" in updated_fields:
            for user_alert_setting in UserAlertSettingUptime.objects.select_related(
                "setting"
            ).filter(blockchain_validator_id=validator_id, setting__status=True):
                prev_value = Decimal(
                    validators_to_update_prev["uptime"][validator_id]
                ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
                next_value = Decimal(updated_fields["uptime"]).quantize(
                    Decimal("0.01"), rounding=ROUND_HALF_UP
                )
                level_value = Decimal(
                    100 - abs(user_alert_setting.setting.value)
                ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

                # Increased Uptime
                if user_alert_setting.setting.value > 0:
                    if prev_value < level_value and next_value >= level_value:
                        print("SUBMIT ALERT UPTIME INCREASED!!!")

                # Decreased Uptime
                else:
                    if prev_value > level_value and next_value <= level_value:
                        print("SUBMIT ALERT UPTIME DECREASED!!!")

        # Comission
        if "commision_rate" in updated_fields:
            for user_alert_setting in UserAlertSettingComission.objects.select_related(
                "setting"
            ).filter(blockchain_validator_id=validator_id, setting__status=True):
                # Increased Comission
                if user_alert_setting.setting.value > 0:
                    if Decimal(updated_fields["commision_rate"]) >= (
                        user_alert_setting.current_value
                        + user_alert_setting.setting.value
                    ):
                        user_alert_setting.current_value = Decimal(
                            updated_fields["commision_rate"]
                        )
                        user_alert_setting.save()

                        print("SUBMIT ALERT COMISSION INCREASED!!!")

                # Decreased Comission
                else:
                    if Decimal(updated_fields["commision_rate"]) <= (
                        user_alert_setting.current_value
                        - abs(user_alert_setting.setting.value)
                    ):
                        user_alert_setting.current_value = Decimal(
                            updated_fields["commision_rate"]
                        )
                        user_alert_setting.save()

                        print("SUBMIT ALERT COMISSION DECREASED!!!")

        # Jailed Status
        if "jailed" in updated_fields:
            for (
                user_alert_setting
            ) in UserAlertSettingJailedStatus.objects.select_related("setting").filter(
                blockchain_validator_id=validator_id, setting__status=True
            ):
                prev_value = validators_to_update_prev["jailed"][validator_id]
                next_value = updated_fields["jailed"]

                # False To True
                if (
                    next_value
                    and user_alert_setting.setting.value
                    == AlertSettingBase.ValueStatus.FALSE_TO_TRUE
                ):
                    print("SUBMIT ALERT JAILED FALSE_TO_TRUE!!!")

                # True To False
                if (
                    not next_value
                    and user_alert_setting.setting.value
                    == AlertSettingBase.ValueStatus.TRUE_TO_FALSE
                ):
                    print("SUBMIT ALERT JAILED TRUE_TO_FALSE!!!")

                # Jailed Status

        # Bond Status
        if "status" in updated_fields:
            for (
                user_alert_setting
            ) in UserAlertSettingBondedStatus.objects.select_related("setting").filter(
                blockchain_validator_id=validator_id, setting__status=True
            ):
                prev_value = validators_to_update_prev["status"][validator_id]
                next_value = updated_fields["status"]

                # False To True
                if (
                    next_value
                    and user_alert_setting.setting.value
                    == AlertSettingBase.ValueStatus.FALSE_TO_TRUE
                ):
                    print("SUBMIT ALERT BONDED FALSE_TO_TRUE!!!")

                # True To False
                if (
                    not next_value
                    and user_alert_setting.setting.value
                    == AlertSettingBase.ValueStatus.TRUE_TO_FALSE
                ):
                    print("SUBMIT ALERT BONDED TRUE_TO_FALSE!!!")

                # Bond Status

        # Tombstoned Status
        if "tombstoned" in updated_fields:
            for (
                user_alert_setting
            ) in UserAlertSettingTombstonedStatus.objects.select_related(
                "setting"
            ).filter(
                blockchain_validator_id=validator_id, setting__status=True
            ):
                next_value = updated_fields["status"]

                if next_value:
                    user_alert_setting.dlete()
                    print("SUBMIT ALERT TOMBSTONED FALSE_TO_TRUE!!!")
