import re
from multiselectfield import MultiSelectField
from decimal import Decimal

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator

from users.models import User
from blockchains.models import BlockchainValidator


class AlertSettingBase(models.Model):
    class AlertType(models.TextChoices):
        VOTING_POWER = "VOTING_POWER", _("Voting Power")
        UPTIME = "UPTIME", _("Uptime")
        COMISSION = "COMISSION", _("Comission")
        JAILED = "JAILED", _("Jailed")
        TOMBSTONED = "TOMBSTONED", _("Tombstoned")
        BONDED = "BONDED", _("Bonded")

    class Channels(models.TextChoices):
        SMS = "SMS", _("SMS")
        VOICE = "VOICE", _("Voice")

    class ValueStatus(models.TextChoices):
        FALSE_TO_TRUE = "FALSE_TO_TRUE", _("False to True")
        TRUE_TO_FALSE = "TRUE_TO_FALSE", _("True to False")

    channels = MultiSelectField(
        choices=Channels.choices,
        max_length=10,
        null=True,
        blank=True,
        verbose_name=_("Alert Channels"),
    )
    template_increase = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("Text Template for increase (False to True)"),
        help_text="""
{name} - will be replaced to full name;<br>
{network} - will be replaced to blockchain network (Celestia Mainnet);<br>
{moniker} - will be replaced to validator moniker;<br>
{from_value} - will be replaced to from value (int, float or bool);<br>
{to_value} - will be replaced to from value (int, float or bool);<br>
""",
    )
    template_decraease = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("Text Template for decrease (True to False)"),
        help_text="""
{name} - will be replaced to full name;<br>
{network} - will be replaced to blockchain network (Celestia Mainnet);<br>
{moniker} - will be replaced to validator moniker;<br>
{from_value} - will be replaced to from value (int, float or bool);<br>
{to_value} - will be replaced to from value (int, float or bool);<br>
""",
    )
    status = models.BooleanField(default=True, verbose_name=_("Enabled"))
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    value = None

    def __str__(self):
        return (
            f"{self.__class__.__name__} ({', '.join(self.channels)}) {self.value or ''}"
        )

    class Meta:
        abstract = True


class AlertSettingVotingPower(AlertSettingBase):
    value = models.IntegerField(
        validators=[
            MinValueValidator(-5000000),
            MaxValueValidator(5000000),
        ],
        verbose_name=_("Value"),
        help_text=_("Positive number to increase, negative to decrease"),
    )

    class Meta:
        verbose_name = _("Voting Power Alert Settings")
        verbose_name_plural = _("Voting Power Alerts Settings")
        ordering = ("value",)


class AlertSettingUptime(AlertSettingBase):
    value = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(-100),
            MaxValueValidator(100),
        ],
        verbose_name=_("Value, %"),
        help_text=_("Positive number to increase, negative to decrease"),
    )

    class Meta:
        verbose_name = _("Uptime Alert Settings")
        verbose_name_plural = _("Uptime Alerts Settings")
        ordering = ("value",)


class AlertSettingComission(AlertSettingBase):
    value = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(-100),
            MaxValueValidator(100),
        ],
        verbose_name=_("Value, %"),
        help_text=_("Positive number to increase, negative to decrease"),
    )

    class Meta:
        verbose_name = _("Comission Alert Settings")
        verbose_name_plural = _("Comission Alerts Settings")
        ordering = ("value",)


class AlertSettingJailedStatus(AlertSettingBase):
    value = models.CharField(
        unique=True,
        max_length=25,
        choices=AlertSettingBase.ValueStatus.choices,
        default=AlertSettingBase.ValueStatus.FALSE_TO_TRUE,
    )

    class Meta:
        verbose_name = _("Jailed Status Alert Settings")
        verbose_name_plural = _("Jailed Status Alerts Settings")


class AlertSettingTombstonedStatus(AlertSettingBase):
    value = models.CharField(
        unique=True,
        max_length=25,
        choices=AlertSettingBase.ValueStatus.choices,
        default=AlertSettingBase.ValueStatus.FALSE_TO_TRUE,
    )

    class Meta:
        verbose_name = _("Tombstoned Status Alert Settings")
        verbose_name_plural = _("Tombstoned Status Alerts Settings")


class AlertSettingBondedStatus(AlertSettingBase):
    value = models.CharField(
        unique=True,
        max_length=25,
        choices=AlertSettingBase.ValueStatus.choices,
        default=AlertSettingBase.ValueStatus.FALSE_TO_TRUE,
    )

    class Meta:
        verbose_name = _("Bond Status Alert Settings")
        verbose_name_plural = _("Bond Status Alerts Settings")


class UserAlertSettingBase(AlertSettingBase):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_alert_settings"
    )
    channels = models.SlugField(
        choices=AlertSettingBase.Channels.choices,
        max_length=10,
        verbose_name=_("Alert Channel"),
    )
    template_increase = None
    template_decraease = None
    current_value = None

    def __str__(self):
        next_value = None
        if (
            isinstance(self.setting.value, (int, Decimal))
            and hasattr(self, "current_value")
            and self.current_value
        ):
            next_value = self.current_value + self.setting.value
        next_value_str = f" -> {next_value}" if next_value is not None else ""

        return f"{self.__class__.__name__} ({self.channels}) {self.current_value}{next_value_str}"

    def generate_alert_text(
        self,
        increase: bool,
        from_value: str,
        to_value: str,
    ) -> str:
        template = (
            self.setting.template_increase
            if increase
            else self.setting.template_decraease
        )
        if not template:
            return ""

        def clean_ascii(text):
            return re.sub(r"[^\x20-\x7E]", "", text)[:140]

        name = clean_ascii(self.user.first_name or "Client")
        network = clean_ascii(self.blockchain_validator.blockchain.name or "")
        moniker = clean_ascii(self.blockchain_validator.moniker or "")

        return template.format(
            name=name,
            network=network,
            moniker=moniker,
            from_value=from_value,
            to_value=to_value,
        )

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
            "setting",
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

    class Meta:
        verbose_name = _("User Alert Setting Uptime")
        verbose_name_plural = _("User Alert Settings Uptime")
        unique_together = (
            "user",
            "blockchain_validator",
            "setting",
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
            "setting",
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

    class Meta:
        verbose_name = _("User Alert Setting Jailed Status")
        verbose_name_plural = _("User Alert Settings Jailed Status")
        unique_together = (
            "user",
            "blockchain_validator",
            "setting",
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

    class Meta:
        verbose_name = _("User Alert Setting Tombstoned Status")
        verbose_name_plural = _("User Alert Settings Tombstoned Status")
        unique_together = (
            "user",
            "blockchain_validator",
            "setting",
        )


class UserAlertSettingBondedStatus(UserAlertSettingBase):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_alert_settings_bonded_status",
    )
    blockchain_validator = models.ForeignKey(
        BlockchainValidator,
        on_delete=models.CASCADE,
        related_name="blockchain_validator_user_alert_settings_bonded_status",
        verbose_name=_("Validator"),
    )
    setting = models.ForeignKey(
        AlertSettingBondedStatus,
        on_delete=models.CASCADE,
        related_name="alert_setting_bonded_status_user_settings",
    )

    class Meta:
        verbose_name = _("User Alert Setting Bond Status")
        verbose_name_plural = _("User Alert Settings Bond Status")
        unique_together = (
            "user",
            "blockchain_validator",
            "setting",
        )
