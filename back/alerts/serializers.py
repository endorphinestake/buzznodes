from django.utils.translation import gettext_lazy as _
from django.core.validators import MaxLengthValidator, RegexValidator
from rest_framework import serializers

from alerts.models import (
    AlertSettingBase,
    AlertSettingVotingPower,
    AlertSettingUptime,
    AlertSettingComission,
    AlertSettingJailedStatus,
    AlertSettingTombstonedStatus,
    AlertSettingBondedStatus,
    AlertSettingOtelUpdate,
    AlertSettingSyncStatus,
    UserAlertSettingVotingPower,
    UserAlertSettingUptime,
    UserAlertSettingComission,
    UserAlertSettingJailedStatus,
    UserAlertSettingTombstonedStatus,
    UserAlertSettingBondedStatus,
    UserAlertSettingOtelUpdate,
    UserAlertSettingSyncStatus,
)
from blockchains.models import BlockchainValidator, BlockchainBridge
from alerts.utils import clean_tags_from_text


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
        fields = AlertSettingBaseSerializer.Meta.fields + ("value",)


class AlertSettingTombstonedStatusSerializer(AlertSettingBaseSerializer):
    class Meta(AlertSettingBaseSerializer.Meta):
        model = AlertSettingTombstonedStatus
        fields = AlertSettingBaseSerializer.Meta.fields + ("value",)


class AlertSettingBondedStatusSerializer(AlertSettingBaseSerializer):
    class Meta(AlertSettingBaseSerializer.Meta):
        model = AlertSettingBondedStatus
        fields = AlertSettingBaseSerializer.Meta.fields + ("value",)


class AlertSettingOtelUpdateSerializer(AlertSettingBaseSerializer):
    class Meta(AlertSettingBaseSerializer.Meta):
        model = AlertSettingOtelUpdate
        fields = AlertSettingBaseSerializer.Meta.fields + ("value",)


class AlertSettingSyncStatusSerializer(AlertSettingBaseSerializer):
    class Meta(AlertSettingBaseSerializer.Meta):
        model = AlertSettingSyncStatus
        fields = AlertSettingBaseSerializer.Meta.fields + ("value",)


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


class UserAlertSettingOtelUpdateSerializer(UserAlertSettingBaseSerializer):
    class Meta(UserAlertSettingBaseSerializer.Meta):
        model = UserAlertSettingOtelUpdate
        fields = UserAlertSettingBaseSerializer.Meta.fields + ("moniker",)


class UserAlertSettingSyncStatusSerializer(UserAlertSettingBaseSerializer):
    class Meta(UserAlertSettingBaseSerializer.Meta):
        model = UserAlertSettingSyncStatus
        fields = UserAlertSettingBaseSerializer.Meta.fields + ("moniker",)


class ManageUserAlertSettingSerializer(serializers.Serializer):
    blockchain_validator_id = serializers.PrimaryKeyRelatedField(
        queryset=BlockchainValidator.objects.filter(tombstoned=False),
        required=False,
        allow_null=True,
    )
    blockchain_bridge_id = serializers.PrimaryKeyRelatedField(
        queryset=BlockchainBridge.objects.all(),
        required=False,
        allow_null=True,
    )
    setting_type = serializers.ChoiceField(
        AlertSettingBase.AlertType.choices, required=True
    )
    setting_id = serializers.IntegerField(required=True)
    user_setting_id = serializers.IntegerField(required=False)  # for update
    channel = serializers.ChoiceField(AlertSettingBase.Channels.choices, required=True)
    moniker = serializers.CharField(
        required=False,
        allow_blank=True,
        validators=[
            MaxLengthValidator(50),
            RegexValidator(
                r"^[\x00-\x7F]+$",
                "Only ASCII characters are allowed for the bridge name",
            ),
        ],
    )
    is_delete = serializers.BooleanField(required=False)

    def validate_setting_id(self, setting_id):
        setting_instance = None
        setting_type = self.initial_data["setting_type"]

        if setting_type == AlertSettingBase.AlertType.VOTING_POWER:
            setting_instance = AlertSettingVotingPower.objects.filter(
                pk=setting_id
            ).first()

        elif setting_type == AlertSettingBase.AlertType.UPTIME:
            setting_instance = AlertSettingUptime.objects.filter(pk=setting_id).first()

        elif setting_type == AlertSettingBase.AlertType.COMISSION:
            setting_instance = AlertSettingComission.objects.filter(
                pk=setting_id
            ).first()

        elif setting_type == AlertSettingBase.AlertType.JAILED:
            setting_instance = AlertSettingJailedStatus.objects.filter(
                pk=setting_id
            ).first()

        elif setting_type == AlertSettingBase.AlertType.TOMBSTONED:
            setting_instance = AlertSettingTombstonedStatus.objects.filter(
                pk=setting_id
            ).first()

        elif setting_type == AlertSettingBase.AlertType.BONDED:
            setting_instance = AlertSettingBondedStatus.objects.filter(
                pk=setting_id
            ).first()

        elif setting_type == AlertSettingBase.AlertType.OTEL_UPDATE:
            setting_instance = AlertSettingOtelUpdate.objects.filter(
                pk=setting_id
            ).first()

        elif setting_type == AlertSettingBase.AlertType.SYNC_STATUS:
            setting_instance = AlertSettingSyncStatus.objects.filter(
                pk=setting_id
            ).first()

        if not setting_instance:
            raise serializers.ValidationError(_("Unknown setting type."))

        self.context["setting"] = setting_instance
        return setting_id

    def validate_user_setting_id(self, user_setting_id):
        user_setting_instance = None
        setting_type = self.initial_data["setting_type"]

        if user_setting_id:
            if setting_type == AlertSettingBase.AlertType.VOTING_POWER:
                user_setting_instance = UserAlertSettingVotingPower.objects.filter(
                    pk=user_setting_id
                ).first()

            elif setting_type == AlertSettingBase.AlertType.UPTIME:
                user_setting_instance = UserAlertSettingUptime.objects.filter(
                    pk=user_setting_id
                ).first()

            elif setting_type == AlertSettingBase.AlertType.COMISSION:
                user_setting_instance = UserAlertSettingComission.objects.filter(
                    pk=user_setting_id
                ).first()

            elif setting_type == AlertSettingBase.AlertType.JAILED:
                user_setting_instance = UserAlertSettingJailedStatus.objects.filter(
                    pk=user_setting_id
                ).first()

            elif setting_type == AlertSettingBase.AlertType.TOMBSTONED:
                user_setting_instance = UserAlertSettingTombstonedStatus.objects.filter(
                    pk=user_setting_id
                ).first()

            elif setting_type == AlertSettingBase.AlertType.BONDED:
                user_setting_instance = UserAlertSettingBondedStatus.objects.filter(
                    pk=user_setting_id
                ).first()

            elif setting_type == AlertSettingBase.AlertType.OTEL_UPDATE:
                user_setting_instance = UserAlertSettingOtelUpdate.objects.filter(
                    pk=user_setting_id
                ).first()

            elif setting_type == AlertSettingBase.AlertType.SYNC_STATUS:
                user_setting_instance = UserAlertSettingSyncStatus.objects.filter(
                    pk=user_setting_id
                ).first()

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

    def validate_moniker(self, value):
        if self.initial_data.get("blockchain_bridge_id") and not value:
            raise serializers.ValidationError("Bridge name is required!")
        return value

    def manage(self, validated_data: dict):
        user = self.context["request"].user
        blockchain_validator = validated_data.get("blockchain_validator_id")
        blockchain_bridge = validated_data.get("blockchain_bridge_id")
        setting_instance = self.context["setting"]
        user_setting_instance = self.context.get("user_setting")

        # Is Deleting
        if validated_data.get("is_delete"):
            if not user_setting_instance:
                raise serializers.ValidationError(
                    {"setting_id": [_("Not passed required params!")]}
                )
            user_setting_instance.delete()
            return user_setting_instance

        elif isinstance(setting_instance, AlertSettingVotingPower):
            # Update
            if user_setting_instance:
                user_setting_instance.setting = setting_instance
                user_setting_instance.channels = validated_data["channel"]
                user_setting_instance.current_value = blockchain_validator.voting_power
                user_setting_instance.save()
                return user_setting_instance

            # Create
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
            )

        elif isinstance(setting_instance, AlertSettingUptime):
            # Update
            if user_setting_instance:
                user_setting_instance.setting = setting_instance
                user_setting_instance.channels = validated_data["channel"]
                user_setting_instance.save()
                return user_setting_instance

            # Create
            if (
                user.user_alert_settings_uptime.filter(
                    blockchain_validator=blockchain_validator,
                    setting=setting_instance,
                ).exists()
                or user.user_alert_settings_uptime.filter(
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
            )

        elif isinstance(setting_instance, AlertSettingComission):
            # Update
            if user_setting_instance:
                user_setting_instance.setting = setting_instance
                user_setting_instance.channels = validated_data["channel"]
                user_setting_instance.current_value = (
                    blockchain_validator.commision_rate
                )
                user_setting_instance.save()
                return user_setting_instance

            # Create
            if (
                user.user_alert_settings_comission.filter(
                    blockchain_validator=blockchain_validator,
                    setting=setting_instance,
                ).exists()
                or user.user_alert_settings_comission.filter(
                    blockchain_validator=blockchain_validator
                ).count()
                >= 2  # 2 total: 1 increased, 1 decreased
            ):
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
            # Update
            if user_setting_instance:
                user_setting_instance.setting = setting_instance
                user_setting_instance.channels = validated_data["channel"]
                user_setting_instance.save()
                return user_setting_instance

            # Create
            if (
                user.user_alert_settings_jailed_status.filter(
                    blockchain_validator=blockchain_validator,
                    setting=setting_instance,
                ).exists()
                or user.user_alert_settings_jailed_status.filter(
                    blockchain_validator=blockchain_validator
                ).count()
                >= 2  # 2 total: 1 false to true, 1 true to false
            ):
                raise serializers.ValidationError(
                    {"setting_id": [_("The Alert already exists!")]}
                )

            return UserAlertSettingJailedStatus.objects.create(
                user=user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
            )

        elif isinstance(setting_instance, AlertSettingTombstonedStatus):
            # Update
            if user_setting_instance:
                user_setting_instance.setting = setting_instance
                user_setting_instance.channels = validated_data["channel"]
                user_setting_instance.save()
                return user_setting_instance

            # Create
            if (
                user.user_alert_settings_tombstoned_status.filter(
                    blockchain_validator=blockchain_validator,
                    setting=setting_instance,
                ).exists()
                or user.user_alert_settings_tombstoned_status.filter(
                    blockchain_validator=blockchain_validator
                ).count()
                >= 1  # 1 total: 1 false to true
            ):
                raise serializers.ValidationError(
                    {"setting_id": [_("The Alert already exists!")]}
                )

            return UserAlertSettingTombstonedStatus.objects.create(
                user=user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
            )

        elif isinstance(setting_instance, AlertSettingBondedStatus):
            # Update
            if user_setting_instance:
                user_setting_instance.setting = setting_instance
                user_setting_instance.channels = validated_data["channel"]
                user_setting_instance.save()
                return user_setting_instance

            # Create
            if (
                user.user_alert_settings_bonded_status.filter(
                    blockchain_validator=blockchain_validator,
                    setting=setting_instance,
                ).exists()
                or user.user_alert_settings_bonded_status.filter(
                    blockchain_validator=blockchain_validator
                ).count()
                >= 2  # 1 total: 1 false to true, 1 true to false
            ):
                raise serializers.ValidationError(
                    {"setting_id": [_("The Alert already exists!")]}
                )

            return UserAlertSettingBondedStatus.objects.create(
                user=user,
                channels=validated_data["channel"],
                blockchain_validator=blockchain_validator,
                setting=setting_instance,
            )

        elif isinstance(setting_instance, AlertSettingOtelUpdate):
            # Update
            if user_setting_instance:
                user_setting_instance.setting = setting_instance
                user_setting_instance.channels = validated_data["channel"]
                user_setting_instance.moniker = validated_data["moniker"]
                user_setting_instance.current_value = (
                    blockchain_bridge.last_timestamp_diff
                )
                user_setting_instance.save()
                return user_setting_instance

            # Create
            if (
                user.user_alert_settings_otel_update.filter(
                    blockchain_validator=blockchain_bridge,
                    setting=setting_instance,
                ).exists()
                or user.user_alert_settings_otel_update.filter(
                    blockchain_validator=blockchain_bridge
                ).count()
                >= 2  # 2 total: 1 increased, 1 decreased
            ):
                raise serializers.ValidationError(
                    {"setting_id": [_("The Alert already exists!")]}
                )

            return UserAlertSettingOtelUpdate.objects.create(
                user=user,
                channels=validated_data["channel"],
                moniker=validated_data["moniker"],
                blockchain_validator=blockchain_bridge,
                setting=setting_instance,
                current_value=blockchain_bridge.last_timestamp_diff,
            )

        elif isinstance(setting_instance, AlertSettingSyncStatus):
            # Update
            if user_setting_instance:
                user_setting_instance.setting = setting_instance
                user_setting_instance.channels = validated_data["channel"]
                user_setting_instance.moniker = validated_data["moniker"]
                user_setting_instance.current_value = blockchain_bridge.node_height_diff
                user_setting_instance.save()
                return user_setting_instance

            # Create
            if (
                user.user_alert_settings_sync_status.filter(
                    blockchain_validator=blockchain_bridge,
                    setting=setting_instance,
                ).exists()
                or user.user_alert_settings_sync_status.filter(
                    blockchain_validator=blockchain_bridge
                ).count()
                >= 2  # 2 total: 1 increased, 1 decreased
            ):
                raise serializers.ValidationError(
                    {"setting_id": [_("The Alert already exists!")]}
                )

            return UserAlertSettingSyncStatus.objects.create(
                user=user,
                channels=validated_data["channel"],
                moniker=validated_data["moniker"],
                blockchain_validator=blockchain_bridge,
                setting=setting_instance,
                current_value=blockchain_bridge.node_height_diff,
            )

        else:
            raise serializers.ValidationError(
                {"setting_id": [_("Unknown setting type!")]}
            )


class AlertBaseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    message_type = serializers.SerializerMethodField()
    setting_id = serializers.IntegerField()
    message = serializers.SerializerMethodField()
    user_phone = serializers.SerializerMethodField()
    status = serializers.CharField()
    created = serializers.DateTimeField()

    def get_message(self, obj):
        return clean_tags_from_text(obj.sent_text)

    def get_user_phone(self, obj):
        return obj.phone.phone if obj.phone else None

    def get_message_type(self, obj):
        return obj.__class__.__name__
