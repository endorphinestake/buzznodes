from decimal import Decimal, ROUND_HALF_UP
from django_rq import job, get_queue
from django.utils.translation import gettext_lazy as _

from alerts.models import (
    AlertSettingBase,
    UserAlertSettingVotingPower,
    UserAlertSettingUptime,
    UserAlertSettingComission,
    UserAlertSettingJailedStatus,
    UserAlertSettingTombstonedStatus,
    UserAlertSettingBondedStatus,
    UserAlertSettingOtelUpdate,
    UserAlertSettingSyncStatus,
)
from sms.models import SMSBase
from voice.models import VoiceBase
from sms.tasks import submit_sms_alert
from voice.tasks import submit_voice_alert
from logs.models import Log


@job("alerts")
def check_alerts(
    validators_to_update: list[tuple[int, dict]],
    validators_to_update_prev: dict,
    bridges_from_to_update_alerts: dict,
):
    queue_sms = get_queue("submit_sms")
    queue_voice = get_queue("submit_voice")

    def _send_alert(
        user_alert_setting: any, alert_text: str, alert_type: AlertSettingBase.AlertType
    ):
        phone_number = user_alert_setting.user.user_phones.filter(status=True).first()
        if alert_text and phone_number:
            if user_alert_setting.channels == AlertSettingBase.Channels.SMS:
                queue_sms.enqueue(
                    submit_sms_alert,
                    provider=SMSBase.Provider.MAIN,
                    phone_number_id=phone_number.id,
                    text=alert_text,
                    atype=alert_type,
                    setting_id=user_alert_setting.setting.id,
                )
            elif user_alert_setting.channels == AlertSettingBase.Channels.VOICE:
                queue_voice.enqueue(
                    submit_voice_alert,
                    provider=VoiceBase.Provider.MAIN,
                    phone_number_id=phone_number.id,
                    text=alert_text,
                    atype=alert_type,
                    setting_id=user_alert_setting.setting.id,
                )
            else:
                Log.warning(f"Unknown UserAlertChannel: {user_alert_setting.channels}!")
        else:
            Log.warning(f"No AlertText or UserPhone for Alert: {user_alert_setting}!")

    # Validator Alerts
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
                        alert_text = user_alert_setting.generate_validator_alert_text(
                            from_value=str(user_alert_setting.current_value),
                            to_value=str(updated_fields["voting_power"]),
                        )

                        user_alert_setting.current_value = int(
                            updated_fields["voting_power"]
                        )
                        user_alert_setting.save()

                        print(
                            f"SUBMIT ALERT VOTING_POWER INCREASED: {alert_text}^",
                        )

                        _send_alert(
                            user_alert_setting=user_alert_setting,
                            alert_text=alert_text,
                            alert_type=AlertSettingBase.AlertType.VOTING_POWER,
                        )

                # Decreased Voting Power
                else:
                    if int(updated_fields["voting_power"]) <= (
                        user_alert_setting.current_value
                        - abs(user_alert_setting.setting.value)
                    ):

                        alert_text = user_alert_setting.generate_validator_alert_text(
                            from_value=str(user_alert_setting.current_value),
                            to_value=str(updated_fields["voting_power"]),
                        )

                        user_alert_setting.current_value = int(
                            updated_fields["voting_power"]
                        )
                        user_alert_setting.save()

                        print(f"SUBMIT ALERT VOTING_POWER DECREASED: {alert_text}^")

                        _send_alert(
                            user_alert_setting=user_alert_setting,
                            alert_text=alert_text,
                            alert_type=AlertSettingBase.AlertType.VOTING_POWER,
                        )

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
                        alert_text = user_alert_setting.generate_validator_alert_text(
                            from_value=str(prev_value),
                            to_value=str(next_value),
                        )

                        print("SUBMIT ALERT UPTIME INCREASED: ", alert_text)

                        _send_alert(
                            user_alert_setting=user_alert_setting,
                            alert_text=alert_text,
                            alert_type=AlertSettingBase.AlertType.UPTIME,
                        )

                # Decreased Uptime
                else:
                    if prev_value > level_value and next_value <= level_value:
                        alert_text = user_alert_setting.generate_validator_alert_text(
                            from_value=str(prev_value),
                            to_value=str(next_value),
                        )

                        print("SUBMIT ALERT UPTIME DECREASED: ", alert_text)

                        _send_alert(
                            user_alert_setting=user_alert_setting,
                            alert_text=alert_text,
                            alert_type=AlertSettingBase.AlertType.UPTIME,
                        )

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

                        alert_text = user_alert_setting.generate_validator_alert_text(
                            from_value=str(user_alert_setting.current_value),
                            to_value=str(
                                Decimal(updated_fields["commision_rate"]).quantize(
                                    Decimal("0.01"), rounding=ROUND_HALF_UP
                                )
                            ),
                        )

                        user_alert_setting.current_value = Decimal(
                            updated_fields["commision_rate"]
                        )
                        user_alert_setting.save()

                        print("SUBMIT ALERT COMISSION INCREASED: ", alert_text)

                        _send_alert(
                            user_alert_setting=user_alert_setting,
                            alert_text=alert_text,
                            alert_type=AlertSettingBase.AlertType.COMISSION,
                        )

                # Decreased Comission
                else:
                    if Decimal(updated_fields["commision_rate"]) <= (
                        user_alert_setting.current_value
                        - abs(user_alert_setting.setting.value)
                    ):
                        alert_text = user_alert_setting.generate_validator_alert_text(
                            from_value=str(user_alert_setting.current_value),
                            to_value=str(
                                Decimal(updated_fields["commision_rate"]).quantize(
                                    Decimal("0.01"), rounding=ROUND_HALF_UP
                                )
                            ),
                        )

                        user_alert_setting.current_value = Decimal(
                            updated_fields["commision_rate"]
                        )
                        user_alert_setting.save()

                        print("SUBMIT ALERT COMISSION DECREASED: ", alert_text)

                        _send_alert(
                            user_alert_setting=user_alert_setting,
                            alert_text=alert_text,
                            alert_type=AlertSettingBase.AlertType.COMISSION,
                        )

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
                    alert_text = user_alert_setting.generate_validator_alert_text(
                        from_value="False",
                        to_value="True",
                    )

                    print("SUBMIT ALERT JAILED FALSE_TO_TRUE: ", alert_text)

                    _send_alert(
                        user_alert_setting=user_alert_setting,
                        alert_text=alert_text,
                        alert_type=AlertSettingBase.AlertType.JAILED,
                    )

                # True To False
                if (
                    not next_value
                    and user_alert_setting.setting.value
                    == AlertSettingBase.ValueStatus.TRUE_TO_FALSE
                ):
                    alert_text = user_alert_setting.generate_validator_alert_text(
                        from_value="True",
                        to_value="False",
                    )
                    print("SUBMIT ALERT JAILED TRUE_TO_FALSE: ", alert_text)

                    _send_alert(
                        user_alert_setting=user_alert_setting,
                        alert_text=alert_text,
                        alert_type=AlertSettingBase.AlertType.JAILED,
                    )

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
                    alert_text = user_alert_setting.generate_validator_alert_text(
                        from_value="False",
                        to_value="True",
                    )

                    print("SUBMIT ALERT BONDED FALSE_TO_TRUE: ", alert_text)

                    _send_alert(
                        user_alert_setting=user_alert_setting,
                        alert_text=alert_text,
                        alert_type=AlertSettingBase.AlertType.BONDED,
                    )

                # True To False
                if (
                    not next_value
                    and user_alert_setting.setting.value
                    == AlertSettingBase.ValueStatus.TRUE_TO_FALSE
                ):
                    alert_text = user_alert_setting.generate_validator_alert_text(
                        from_value="True",
                        to_value="False",
                    )

                    print("SUBMIT ALERT BONDED TRUE_TO_FALSE: ", alert_text)

                    _send_alert(
                        user_alert_setting=user_alert_setting,
                        alert_text=alert_text,
                        alert_type=AlertSettingBase.AlertType.BONDED,
                    )

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
                    alert_text = user_alert_setting.generate_validator_alert_text(
                        from_value="False",
                        to_value="True",
                    )

                    print("SUBMIT ALERT TOMBSTONED FALSE_TO_TRUE: ", alert_text)
                    _send_alert(
                        user_alert_setting=user_alert_setting,
                        alert_text=alert_text,
                        alert_type=AlertSettingBase.AlertType.TOMBSTONED,
                    )
                    user_alert_setting.delete()

    # Bridge Node Height
    for bridge_id, values in bridges_from_to_update_alerts["node_height_diff"].items():
        prev_value = values[0]
        next_value = values[1]

        if prev_value < 100 and next_value < 100:
            continue

        for user_alert_setting in UserAlertSettingSyncStatus.objects.select_related(
            "setting"
        ).filter(blockchain_validator_id=bridge_id, setting__status=True):
            level_value = user_alert_setting.setting.value

            # Increased NodeHeight Different (Warning)
            if level_value > 0:
                if prev_value < level_value and next_value >= level_value:
                    alert_text = user_alert_setting.generate_validator_alert_text(
                        from_value=str(prev_value),
                        to_value=str(next_value),
                    )

                    print("SUBMIT ALERT SYNC_STATUS INCREASED: ", alert_text)

                    _send_alert(
                        user_alert_setting=user_alert_setting,
                        alert_text=alert_text,
                        alert_type=AlertSettingBase.AlertType.SYNC_STATUS,
                    )

            # Decreased NodeHeight Different (Recovering)
            else:
                if prev_value > level_value and next_value <= level_value:
                    alert_text = user_alert_setting.generate_validator_alert_text(
                        from_value=str(prev_value),
                        to_value=str(next_value),
                    )

                    print("SUBMIT ALERT SYNC_STATUS DECREASED: ", alert_text)

                    # _send_alert(
                    #     user_alert_setting=user_alert_setting,
                    #     alert_text=alert_text,
                    #     alert_type=AlertSettingBase.AlertType.SYNC_STATUS,
                    # )

    # Bridge Otel Update
    for bridge_id, values in bridges_from_to_update_alerts[
        "last_timestamp_diff"
    ].items():
        prev_value = values[0]
        next_value = values[1]

        if prev_value < 3 and next_value < 3:
            continue

        for user_alert_setting in UserAlertSettingOtelUpdate.objects.select_related(
            "setting"
        ).filter(blockchain_validator_id=bridge_id, setting__status=True):
            level_value = user_alert_setting.setting.value

            # Increased OtelUpdate Different (Warning)
            if prev_value < level_value and next_value >= level_value:
                alert_text = user_alert_setting.generate_validator_alert_text(
                    from_value=str(prev_value),
                    to_value=str(next_value),
                )

                print("SUBMIT ALERT OTEL_UPDATED INCREASED: ", alert_text)

                # _send_alert(
                #     user_alert_setting=user_alert_setting,
                #     alert_text=alert_text,
                #     alert_type=AlertSettingBase.AlertType.OTEL_UPDATE,
                # )
