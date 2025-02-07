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


class AlertSettingVotingPowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingVotingPower
        fields = (
            "id",
            "channels",
            "value",
        )


class AlertSettingUptimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingUptime
        fields = (
            "id",
            "channels",
            "value",
        )


class AlertSettingComissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingComission
        fields = (
            "id",
            "channels",
            "value",
        )


class AlertSettingJailedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingJailedStatus
        fields = (
            "id",
            "channels",
            "false_to_true",
            "true_to_false",
        )


class AlertSettingTombstonedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingTombstonedStatus
        fields = (
            "id",
            "channels",
            "false_to_true",
        )


class AlertSettingBondedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSettingBondedStatus
        fields = (
            "id",
            "channels",
            "false_to_true",
            "true_to_false",
        )


class UserAlertSettingVotingPowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingVotingPower
        fields = (
            "id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class UserAlertSettingUptimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingUptime
        fields = (
            "id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class UserAlertSettingComissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingComission
        fields = (
            "id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class UserAlertSettingJailedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingJailedStatus
        fields = (
            "id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class UserAlertSettingTombstonedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingTombstonedStatus
        fields = (
            "id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class UserAlertSettingBondedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAlertSettingBondedStatus
        fields = (
            "id",
            "blockchain_validator_id",
            "channels",
            "setting_id",
        )


class ManageUserAlertSettingSerializer(serializers.Serializer):
    blockchain_validator_id = serializers.PrimaryKeyRelatedField(
        queryset=BlockchainValidator.objects.all()
    )
    setting_id = serializers.IntegerField(required=True)
    user_setting_id = serializers.IntegerField(required=False)  # for update
    channel = serializers.ChoiceField(AlertSettingBase.AlertType.choices, required=True)
    is_delete = serializers.BooleanField(required=False)

    def validate_setting_id(self, setting_id):
        setting_instance = None
        # channel = self.initial_data.get("channel")
        setting_models = [
            AlertSettingVotingPower,
            AlertSettingUptime,
            AlertSettingComission,
            AlertSettingJailedStatus,
            AlertSettingTombstonedStatus,
        ]

        for model in setting_models:
            try:
                setting_instance = model.objects.get(pk=setting_id)
                break
            except model.DoesNotExist:
                continue

        if not setting_instance:
            raise serializers.ValidationError(_("Unknown setting type."))

        # if channel not in setting_instance.channels:
        #     raise serializers.ValidationError(
        #         _("The alert channel is not available for this setting.")
        #     )

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

    def create(self, validated_data: dict):
        # blockchain_validator = BlockchainValidator.objects.get(
        #     id=validated_data["blockchain_validator_id"]
        # )
        blockchain_validator = self.initial_data["blockchain_validator_id"]
        setting_instance = self.context["setting"]

        if isinstance(setting_instance, AlertSettingVotingPower):
            if (
                self.context["request"]
                .user.user_alert_settings_voting_power.filter(
                    blockchain_validator=blockchain_validator
                )
                .exists()
            ):
                raise serializers.ValidationError(_("The Alert already exists!"))
            return UserAlertSettingVotingPower.objects.create(
                user=self.context["request"].user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.voting_power,
            )
        elif isinstance(setting_instance, AlertSettingUptime):
            if (
                self.context["request"]
                .user.user_alert_settings_uptime.filter(
                    blockchain_validator=blockchain_validator
                )
                .exists()
            ):
                raise serializers.ValidationError(_("The Alert already exists!"))
            return UserAlertSettingUptime.objects.create(
                user=self.context["request"].user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.uptime,
            )
        elif isinstance(setting_instance, AlertSettingComission):
            if (
                self.context["request"]
                .user.user_alert_settings_comission.filter(
                    blockchain_validator=blockchain_validator
                )
                .exists()
            ):
                raise serializers.ValidationError(_("The Alert already exists!"))
            return UserAlertSettingComission.objects.create(
                user=self.context["request"].user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.commision_rate,
            )
        elif isinstance(setting_instance, AlertSettingJailedStatus):
            if (
                self.context["request"]
                .user.user_alert_settings_jailed_status.filter(
                    blockchain_validator=blockchain_validator
                )
                .exists()
            ):
                raise serializers.ValidationError(_("The Alert already exists!"))
            return UserAlertSettingJailedStatus.objects.create(
                user=self.context["request"].user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.jailed,
            )
        elif isinstance(setting_instance, AlertSettingTombstonedStatus):
            if (
                self.context["request"]
                .user.user_alert_settings_tombstoned_status.filter(
                    blockchain_validator=blockchain_validator
                )
                .exists()
            ):
                raise serializers.ValidationError(_("The Alert already exists!"))
            return UserAlertSettingTombstonedStatus.objects.create(
                user=self.context["request"].user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
                current_value=blockchain_validator.tombstoned,
            )
        else:
            raise serializers.ValidationError(_("Unknown setting type."))

    def update_or_delete(self, validated_data: dict):
        setting_instance = self.context["setting"]
        user_setting_instance = self.context["user_setting"]

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
