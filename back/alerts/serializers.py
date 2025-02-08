from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from alerts.models import (
    AlertSettingBase,
    AlertSettingVotingPower,
    AlertSettingUptime,
    AlertSettingComission,
    AlertSettingJailedStatus,
    AlertSettingTombstonedStatus,
    AlertSettingBondedStatus,
    UserAlertSettingVotingPower,
    UserAlertSettingUptime,
    UserAlertSettingComission,
    UserAlertSettingJailedStatus,
    UserAlertSettingTombstonedStatus,
    UserAlertSettingBondedStatus,
)
from blockchains.models import BlockchainValidator


class AlertSettingBaseSerializer(serializers.ModelSerializer):
    channels = serializers.ListField(
        child=serializers.CharField(),
        default=list,
        required=False,
    )

    class Meta:
        fields = ("id", "channels")


class AlertSettingVotingPowerSerializer(AlertSettingBaseSerializer):
    class Meta(AlertSettingBaseSerializer.Meta):
        model = AlertSettingVotingPower
        fields = AlertSettingBaseSerializer.Meta.fields + ("value",)


class AlertSettingUptimeSerializer(AlertSettingBaseSerializer):
    class Meta(AlertSettingBaseSerializer.Meta):
        model = AlertSettingUptime
        fields = AlertSettingBaseSerializer.Meta.fields + ("value",)


class AlertSettingComissionSerializer(AlertSettingBaseSerializer):
    class Meta(AlertSettingBaseSerializer.Meta):
        model = AlertSettingComission
        fields = AlertSettingBaseSerializer.Meta.fields + ("value",)


class AlertSettingJailedStatusSerializer(AlertSettingBaseSerializer):
    class Meta(AlertSettingBaseSerializer.Meta):
        model = AlertSettingJailedStatus
        fields = AlertSettingBaseSerializer.Meta.fields + (
            "false_to_true",
            "true_to_false",
        )


class AlertSettingTombstonedStatusSerializer(AlertSettingBaseSerializer):
    class Meta(AlertSettingBaseSerializer.Meta):
        model = AlertSettingTombstonedStatus
        fields = AlertSettingBaseSerializer.Meta.fields + ("false_to_true",)


class AlertSettingBondedStatusSerializer(AlertSettingBaseSerializer):
    class Meta(AlertSettingBaseSerializer.Meta):
        model = AlertSettingBondedStatus
        fields = AlertSettingBaseSerializer.Meta.fields + (
            "false_to_true",
            "true_to_false",
        )


class UserAlertSettingBaseSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class UserAlertSettingVotingPowerSerializer(UserAlertSettingBaseSerializer):
    class Meta(UserAlertSettingBaseSerializer.Meta):
        model = UserAlertSettingVotingPower


class UserAlertSettingUptimeSerializer(UserAlertSettingBaseSerializer):
    class Meta(UserAlertSettingBaseSerializer.Meta):
        model = UserAlertSettingUptime


class UserAlertSettingComissionSerializer(UserAlertSettingBaseSerializer):
    class Meta(UserAlertSettingBaseSerializer.Meta):
        model = UserAlertSettingComission


class UserAlertSettingJailedStatusSerializer(UserAlertSettingBaseSerializer):
    class Meta(UserAlertSettingBaseSerializer.Meta):
        model = UserAlertSettingJailedStatus


class UserAlertSettingTombstonedStatusSerializer(UserAlertSettingBaseSerializer):
    class Meta(UserAlertSettingBaseSerializer.Meta):
        model = UserAlertSettingTombstonedStatus


class UserAlertSettingBondedStatusSerializer(UserAlertSettingBaseSerializer):
    class Meta(UserAlertSettingBaseSerializer.Meta):
        model = UserAlertSettingBondedStatus


class ManageUserAlertSettingSerializer(serializers.Serializer):
    blockchain_validator_id = serializers.PrimaryKeyRelatedField(
        queryset=BlockchainValidator.objects.filter(tombstoned=False)
    )
    setting_id = serializers.IntegerField(required=True)
    user_setting_id = serializers.IntegerField(required=False)  # for update
    channel = serializers.ChoiceField(AlertSettingBase.Channels.choices, required=True)
    is_delete = serializers.BooleanField(required=False)

    def validate_setting_id(self, setting_id):
        setting_instance = None
        setting_models = [
            AlertSettingVotingPower,
            AlertSettingUptime,
            AlertSettingComission,
            AlertSettingJailedStatus,
            AlertSettingTombstonedStatus,
            AlertSettingBondedStatus,
        ]

        for model in setting_models:
            try:
                setting_instance = model.objects.get(pk=setting_id)
                break
            except model.DoesNotExist:
                continue

        if not setting_instance:
            raise serializers.ValidationError(_("Unknown setting type."))

        self.context["setting"] = setting_instance
        return setting_id

    def validate_user_setting_id(self, user_setting_id):
        user_setting_instance = None
        if user_setting_id:
            user_setting_models = [
                UserAlertSettingVotingPower,
                UserAlertSettingUptime,
                UserAlertSettingComission,
                UserAlertSettingJailedStatus,
                UserAlertSettingTombstonedStatus,
                UserAlertSettingBondedStatus,
            ]

            for model in user_setting_models:
                try:
                    user_setting_instance = model.objects.get(
                        pk=user_setting_id, user=self.context["request"].user
                    )
                    break
                except model.DoesNotExist:
                    continue

            if not user_setting_instance:
                raise serializers.ValidationError(_("Unknown setting type."))

        self.context["user_setting"] = user_setting_instance
        return user_setting_id

    def validate_channel(self, channel):
        is_delete = self.initial_data.get("is_delete", False)

        if channel not in self.context["setting"].channels and not is_delete:
            raise serializers.ValidationError(
                _("The alert channel is not available for this setting.")
            )
        return channel

    def manage(self, validated_data: dict):
        user = self.context["request"].user
        blockchain_validator = validated_data["blockchain_validator_id"]
        setting_instance = self.context["setting"]
        user_setting_instance = self.context.get("user_setting")

        if isinstance(setting_instance, AlertSettingVotingPower):
            # Delete
            if validated_data.get("is_delete"):
                if not user_setting_instance:
                    raise serializers.ValidationError(
                        {"setting_id": [_("Not passed required params!")]}
                    )

                user_setting_instance.delete()
                return user_setting_instance

            # Update
            elif user_setting_instance:
                user_setting_instance.setting = setting_instance
                user_setting_instance.channels = validated_data["channel"]
                user_setting_instance.current_value = blockchain_validator.voting_power
                user_setting_instance.next_value += setting_instance.value
                user_setting_instance.save()
                return user_setting_instance

            # Create
            else:
                if (
                    user.user_alert_settings_voting_power.filter(
                        blockchain_validator=blockchain_validator,
                        setting=setting_instance,
                    ).exists()
                    or user.user_alert_settings_voting_power.filter(
                        blockchain_validator=blockchain_validator
                    ).count()
                    >= 2  # 2 total: 1 increased, 1 decreased
                ):
                    raise serializers.ValidationError(
                        {"setting_id": [_("The Alert already exists!")]}
                    )

                return UserAlertSettingVotingPower.objects.create(
                    user=user,
                    channels=validated_data["channel"],
                    blockchain_validator=blockchain_validator,
                    setting=setting_instance,
                    current_value=blockchain_validator.voting_power,
                    next_value=(
                        blockchain_validator.voting_power + setting_instance.value
                    ),
                )
        elif isinstance(setting_instance, AlertSettingUptime):
            # Delete
            if validated_data.get("is_delete"):
                if not user_setting_instance:
                    raise serializers.ValidationError(
                        {"setting_id": [_("Not passed required params!")]}
                    )

                user_setting_instance.delete()
                return user_setting_instance

            # Update
            elif user_setting_instance:
                user_setting_instance.setting = setting_instance
                user_setting_instance.channels = validated_data["channel"]
                # user_setting_instance.current_value = blockchain_validator.voting_power
                # user_setting_instance.next_value += setting_instance.value
                user_setting_instance.save()
                return user_setting_instance

            # Create
            else:
                if (
                    user.alert_setting_uptime_user_settings.filter(
                        blockchain_validator=blockchain_validator,
                        setting=setting_instance,
                    ).exists()
                    or user.alert_setting_uptime_user_settings.filter(
                        blockchain_validator=blockchain_validator
                    ).count()
                    >= 2  # 2 total: 1 increased, 1 decreased
                ):
                    raise serializers.ValidationError(
                        {"setting_id": [_("The Alert already exists!")]}
                    )

                return UserAlertSettingUptime.objects.create(
                    user=user,
                    channels=validated_data["channel"],
                    blockchain_validator=blockchain_validator,
                    setting=setting_instance,
                    # current_value=blockchain_validator.uptime,
                    # next_value=(
                    #     blockchain_validator.voting_power + setting_instance.value
                    # ),
                )
        elif isinstance(setting_instance, AlertSettingComission):
            if user.user_alert_settings_comission.filter(
                blockchain_validator=blockchain_validator
            ).exists():
                raise serializers.ValidationError(
                    {"setting_id": [_("The Alert already exists!")]}
                )
            return UserAlertSettingComission.objects.create(
                user=user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.commision_rate,
            )
        elif isinstance(setting_instance, AlertSettingJailedStatus):
            if user.user_alert_settings_jailed_status.filter(
                blockchain_validator=blockchain_validator
            ).exists():
                raise serializers.ValidationError(
                    {"setting_id": [_("The Alert already exists!")]}
                )
            return UserAlertSettingJailedStatus.objects.create(
                user=user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.jailed,
            )
        elif isinstance(setting_instance, AlertSettingTombstonedStatus):
            if user.user_alert_settings_tombstoned_status.filter(
                blockchain_validator=blockchain_validator
            ).exists():
                raise serializers.ValidationError(
                    {"setting_id": [_("The Alert already exists!")]}
                )
            return UserAlertSettingTombstonedStatus.objects.create(
                user=user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.tombstoned,
            )
        else:
            raise serializers.ValidationError(
                {"setting_id": [_("Unknown setting type!")]}
            )

    def update_or_delete(self, validated_data: dict):
        setting_instance = self.context["setting"]
        user_setting_instance = self.context.get("user_setting", None)

        if not user_setting_instance:
            return None

        if validated_data.get("is_delete"):
            user_setting_instance.delete()
        else:
            user_setting_instance.setting = setting_instance
            user_setting_instance.channels = validated_data.get(
                "channel", user_setting_instance.channels
            )
            user_setting_instance.save()
