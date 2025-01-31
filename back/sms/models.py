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


class SMSAlert(models.Model):
    class Status(models.TextChoices):
        SENT = "SENT", _("Sent")
        DELIVERED = "DELIVERED", _("Delivered")
        UNDELIVRED = "UNDELIVRED", _("Undelivered")
        REJECTED = "REJECTED", _("Rejected")
        ERROR = "ERROR", _("Error")

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_sms", verbose_name=_("User")
    )
    phone = models.ForeignKey(
        UserPhone,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Phone Number"),
    )
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
    sent_text = models.TextField(verbose_name=_("SMS Text"))

    status = models.SlugField(
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
        return f"{self.phone} -> {self.sent_text}"

    class Meta:
        verbose_name = _("SMS Alert")
        verbose_name_plural = _("SMS Alerts")


class SMSConfirm(SMSAlert):
    user_alert_setting_voting_power = None
    user_alert_setting_uptime = None
    user_alert_setting_comission = None
    user_alert_setting_jailed_status = None
    user_alert_setting_tombstoned_status = None

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
