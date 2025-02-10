from typing import Any
from decimal import Decimal
from django_rq import job
from django.utils.translation import gettext_lazy as _

from blockchains.models import BlockchainValidator
from alerts.models import UserAlertSettingVotingPower


@job("alerts")
def check_alerts(validators_to_update: list[tuple[int, dict[str, Any]]]):
    print(f"check_alerts: {validators_to_update}")

    for validator_id, updated_fields in validators_to_update:
        # Voting Power Alerts
        if updated_fields.get("voting_power"):
            for (
                user_alert_setting
            ) in UserAlertSettingVotingPower.objects.select_related("setting").filter(
                blockchain_validator_id=validator_id, setting__status=True
            ):
                print("user_alert_setting: ", user_alert_setting)

                # Increased Voting Power
                if user_alert_setting.setting.value > 0:
                    if int(updated_fields["voting_power"]) >= (
                        user_alert_setting.current_value
                        + user_alert_setting.setting.value
                    ):
                        print("SUBMIT ALERT!!!")

                # Decreased Voting Power
                else:
                    pass

                pass
