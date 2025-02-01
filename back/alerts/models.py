from multiselectfield import MultiSelectField

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator

from users.models import User
from blockchains.models import BlockchainValidator


class AlertSettingBase(models.Model):
    class Channels(models.TextChoices):
        SMS = "SMS", _("SMS")
        VOICE = "VOICE", _("Voice")

    channels = MultiSelectField(
        choices=Channels.choices, max_length=10, verbose_name=_("Alert Channels")
    )
    sms_template = models.TextField(verbose_name=_("SMS Template"))
    voice_template = models.TextField(verbose_name=_("Voice Template"))
    status = models.BooleanField(default=True, verbose_name=_("Enabled"))
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.__class__.__name__} ({', '.join(self.channels)})"

    class Meta:
        abstract = True


class AlertSettingVotingPower(AlertSettingBase):
    value_from = models.IntegerField(
        validators=[
            MinValueValidator(100000),
            MaxValueValidator(5000000),
        ],
        verbose_name=_("Value from"),
    )
    value_to = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(100000),
            MaxValueValidator(5000000),
        ],
        verbose_name=_("Value to"),
    )

    class Meta:
        verbose_name = _("Voting Power Alert Settings")
        verbose_name_plural = _("Voting Power Alerts Settings")
        ordering = ("value_from",)


class AlertSettingUptime(AlertSettingBase):
    value_from = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0.01),
            MaxValueValidator(100),
        ],
        verbose_name=_("Value from, %"),
    )
    value_to = models.DecimalField(
        null=True,
        blank=True,
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0.01),
            MaxValueValidator(100),
        ],
        verbose_name=_("Value to, %"),
    )

    class Meta:
        verbose_name = _("Uptime Alert Settings")
        verbose_name_plural = _("Uptime Alerts Settings")
        ordering = ("value_from",)


class AlertSettingComission(AlertSettingBase):
    value_from = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0.01),
            MaxValueValidator(100),
        ],
        verbose_name=_("Value from, %"),
    )
    value_to = models.DecimalField(
        null=True,
        blank=True,
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0.01),
            MaxValueValidator(100),
        ],
        verbose_name=_("Value to, %"),
    )

    class Meta:
        verbose_name = _("Comission Alert Settings")
        verbose_name_plural = _("Comission Alerts Settings")
        ordering = ("value_from",)


class AlertSettingJailedStatus(AlertSettingBase):
    false_to_true = models.BooleanField(default=True)
    true_to_false = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Jailed Status Alert Settings")
        verbose_name_plural = _("Jailed Status Alerts Settings")


class AlertSettingTombstonedStatus(AlertSettingBase):
    false_to_true = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Tombstoned Status Alert Settings")
        verbose_name_plural = _("Tombstoned Status Alerts Settings")


class UserAlertSettingBase(AlertSettingBase):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_alert_settings"
    )
    channels = models.SlugField(
        choices=AlertSettingBase.Channels.choices,
        max_length=10,
        verbose_name=_("Alert Channel"),
    )
    sms_template = None
    voice_template = None

    class Meta:
        abstract = True


class UserAlertSettingVotingPower(UserAlertSettingBase):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_alert_settings_voting_power"
    )
    blockchain_validator = models.ForeignKey(
        BlockchainValidator,
        on_delete=models.CASCADE,
        related_name="blockchain_validator_user_alert_settings_voting_power",
        verbose_name=_("Validator"),
    )
    setting = models.ForeignKey(
        AlertSettingVotingPower,
        on_delete=models.CASCADE,
        related_name="alert_setting_voting_power_user_settings",
    )
    current_value = models.IntegerField(verbose_name=_("Current Value"))

    class Meta:
        verbose_name = _("User Alert Setting Voting Power")
        verbose_name_plural = _("User Alert Settings Voting Power")
        unique_together = (
            "user",
            "blockchain_validator",
        )


class UserAlertSettingUptime(UserAlertSettingBase):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_alert_settings_uptime"
    )
    blockchain_validator = models.ForeignKey(
        BlockchainValidator,
        on_delete=models.CASCADE,
        related_name="blockchain_validator_user_alert_settings_uptime",
        verbose_name=_("Validator"),
    )
    setting = models.ForeignKey(
        AlertSettingUptime,
        on_delete=models.CASCADE,
        related_name="alert_setting_uptime_user_settings",
    )
    current_value = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        verbose_name=_("Current Value"),
    )

    class Meta:
        verbose_name = _("User Alert Setting Uptime")
        verbose_name_plural = _("User Alert Settings Uptime")
        unique_together = (
            "user",
            "blockchain_validator",
        )


class UserAlertSettingComission(UserAlertSettingBase):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_alert_settings_comission"
    )
    blockchain_validator = models.ForeignKey(
        BlockchainValidator,
        on_delete=models.CASCADE,
        related_name="blockchain_validator_user_alert_settings_comission",
        verbose_name=_("Validator"),
    )
    setting = models.ForeignKey(
        AlertSettingComission,
        on_delete=models.CASCADE,
        related_name="alert_setting_comission_user_settings",
    )
    current_value = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        verbose_name=_("Current Value"),
    )

    class Meta:
        verbose_name = _("User Alert Setting Comission")
        verbose_name_plural = _("User Alert Settings Comission")
        unique_together = (
            "user",
            "blockchain_validator",
        )


class UserAlertSettingJailedStatus(UserAlertSettingBase):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_alert_settings_jailed_status"
    )
    blockchain_validator = models.ForeignKey(
        BlockchainValidator,
        on_delete=models.CASCADE,
        related_name="blockchain_validator_user_alert_settings_jailed_status",
        verbose_name=_("Validator"),
    )
    setting = models.ForeignKey(
        AlertSettingJailedStatus,
        on_delete=models.CASCADE,
        related_name="alert_setting_jailed_status_user_settings",
    )
    current_value = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("User Alert Setting Jailed Status")
        verbose_name_plural = _("User Alert Settings Jailed Status")
        unique_together = (
            "user",
            "blockchain_validator",
        )


class UserAlertSettingTombstonedStatus(UserAlertSettingBase):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_alert_settings_tombstoned_status",
    )
    blockchain_validator = models.ForeignKey(
        BlockchainValidator,
        on_delete=models.CASCADE,
        related_name="blockchain_validator_user_alert_settings_tombstoned_status",
        verbose_name=_("Validator"),
    )
    setting = models.ForeignKey(
        AlertSettingTombstonedStatus,
        on_delete=models.CASCADE,
        related_name="alert_setting_tombstoned_status_user_settings",
    )
    current_value = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("User Alert Setting Tombstoned Status")
        verbose_name_plural = _("User Alert Settings Tombstoned Status")
        unique_together = (
            "user",
            "blockchain_validator",
        )
