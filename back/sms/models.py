from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import User, UserPhone
from alerts.models import (
    UserAlertSettingVotingPower,
    UserAlertSettingUptime,
    UserAlertSettingComission,
    UserAlertSettingJailedStatus,
    UserAlertSettingTombstonedStatus,
)


class SMSBase(models.Model):
    class Provider(models.TextChoices):
        MAIN = "MAIN", _("Main (Hicell)")
        RESERVE1 = "RESERVE1", _("Reserve (Bird)")

    class Status(models.TextChoices):
        SENT = "SENT", _("Sent")
        DELIVERED = "DELIVERED", _("Delivered")
        UNDELIVRED = "UNDELIVRED", _("Undelivered")
        REJECTED = "REJECTED", _("Rejected")
        ERROR = "ERROR", _("Error")

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_("User"))
    phone = models.ForeignKey(
        UserPhone,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Phone Number"),
    )
    sms_id = models.CharField(
        db_index=True,
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_("Provider SMS ID"),
    )
    sent_text = models.TextField(verbose_name=_("SMS Text"))
    provider = models.CharField(
        choices=Status.choices,
        max_length=25,
        default=Provider.MAIN,
        verbose_name=_("SMS Provider"),
    )
    status = models.CharField(
        db_index=True,
        choices=Status.choices,
        max_length=25,
        default=Status.SENT,
        verbose_name=_("Status"),
    )
    err = models.CharField(
        max_length=256, null=True, blank=True, verbose_name=_("Error Details")
    )
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.phone} -> {self.sent_text[:50]}"

    class Meta:
        abstract = True


class SMSAlert(SMSBase):
    user_alert_setting_voting_power = models.ForeignKey(
        UserAlertSettingVotingPower,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user_alert_setting_voting_power_sms",
        verbose_name=_("Voting Power Alert Settings"),
    )
    user_alert_setting_uptime = models.ForeignKey(
        UserAlertSettingUptime,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user_alert_setting_uptime_sms",
        verbose_name=_("User Alert Setting Uptime"),
    )
    user_alert_setting_comission = models.ForeignKey(
        UserAlertSettingComission,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user_alert_setting_comission_sms",
        verbose_name=_("User Alert Setting Comission"),
    )
    user_alert_setting_jailed_status = models.ForeignKey(
        UserAlertSettingJailedStatus,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user_alert_setting_jailed_status_sms",
        verbose_name=_("User Alert Setting Jailed Status"),
    )
    user_alert_setting_tombstoned_status = models.ForeignKey(
        UserAlertSettingTombstonedStatus,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user_alert_setting_tombstoned_status_sms",
        verbose_name=_("User Alert Setting Tombstoned Status"),
    )

    class Meta:
        verbose_name = _("SMS Alert")
        verbose_name_plural = _("SMS Alerts")


class SMSConfirm(SMSBase):
    code = models.CharField(
        max_length=25,
        blank=True,
        null=True,
        verbose_name=_("Confirmation Code"),
    )
    expire_code = models.DateTimeField(
        db_index=True,
        null=True,
        blank=True,
        verbose_name=_("Code expiration date"),
    )
    is_used = models.BooleanField(default=False, verbose_name=_("Used"))

    class Meta:
        verbose_name = _("SMS Confirm")
        verbose_name_plural = _("SMS Confirms")
