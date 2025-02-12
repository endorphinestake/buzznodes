from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import User, UserPhone
from alerts.models import (
    AlertSettingVotingPower,
    AlertSettingUptime,
    AlertSettingComission,
    AlertSettingJailedStatus,
    AlertSettingTombstonedStatus,
    AlertSettingBondedStatus,
)


class VoiceBase(models.Model):
    class VType(models.TextChoices):
        ALERT = "ALERT", _("Alert")

    class Provider(models.TextChoices):
        MAIN = "MAIN", _("Main (Unitalk.cloud)")
        RESERVE1 = "RESERVE1", _("Reserve (Bird)")

    class Status(models.TextChoices):
        NEW = "NEW", _("New")  # Создан и поставлен в очередь
        SENT = "SENT", _("Sent")  # Отправлено провайдеру
        STARTING = "STARTING", _("starting")  # Произведен вызов
        RINGING = "RINGING", _("Ringing")  # Идет вызов, абонент слышыт звонок
        ONGOING = "ONGOING", _("Ongoing")  # Абонент принял и слышыт голос робота
        COMPLETED = "COMPLETED", _("Сompleted")  # Робот успешно завершил звонок (final)
        NO_ANSWER = "NO_ANSWER", _("No answer")  # Не принял или отклонил вызов (final)
        BUSY = "BUSY", _("Busy")  # Абонент занят (final)
        ERROR = "ERROR", _("Error")  # Ошибка при создании звонка (final)

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_("User"))
    phone = models.ForeignKey(
        UserPhone,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Phone Number"),
    )
    voice_id = models.CharField(
        db_index=True,
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_("Provider Call ID"),
    )
    sent_text = models.TextField(verbose_name=_("Voice Text"))
    provider = models.CharField(
        choices=Provider.choices,
        max_length=25,
        default=Provider.MAIN,
        verbose_name=_("Voice Provider"),
    )
    status = models.CharField(
        db_index=True,
        choices=Status.choices,
        max_length=25,
        default=Status.NEW,
        verbose_name=_("Status"),
    )
    err = models.CharField(
        max_length=256, null=True, blank=True, verbose_name=_("Error Details")
    )
    is_resent = models.BooleanField(
        default=False, verbose_name=_("Is Resended via Reserved channel")
    )
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.phone} -> {self.sent_text[:50]}"

    class Meta:
        abstract = True


class VoiceAlertVotingPower(VoiceBase):
    setting = models.ForeignKey(
        AlertSettingVotingPower,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alert_setting_voting_power_voice",
        verbose_name=_("Voting Power Alert Settings"),
    )

    class Meta:
        verbose_name = _("Voting Power Voice Alert")
        verbose_name_plural = _("Voting Power Voice Alerts")


class VoiceAlertUptime(VoiceBase):
    setting = models.ForeignKey(
        AlertSettingUptime,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alert_setting_uptime_voice",
        verbose_name=_("Uptime Alert Settings"),
    )

    class Meta:
        verbose_name = _("Uptime Voice Alert")
        verbose_name_plural = _("Uptime Voice Alerts")


class VoiceAlertComission(VoiceBase):
    setting = models.ForeignKey(
        AlertSettingComission,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alert_setting_comission_voice",
        verbose_name=_("Comission Alert Settings"),
    )

    class Meta:
        verbose_name = _("Comission Voice Alert")
        verbose_name_plural = _("Comission Voice Alerts")


class VoiceAlertJailedStatus(VoiceBase):
    setting = models.ForeignKey(
        AlertSettingJailedStatus,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alert_setting_jailed_status_voice",
        verbose_name=_("Jailed Alert Setting"),
    )

    class Meta:
        verbose_name = _("Jailed Voice Alert")
        verbose_name_plural = _("jailed Voice Alerts")


class VoiceAlertTombstonedStatus(VoiceBase):
    setting = models.ForeignKey(
        AlertSettingTombstonedStatus,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alert_setting_tombstoned_status_voice",
        verbose_name=_("Tombstoned Alert Settings"),
    )

    class Meta:
        verbose_name = _("Tombstoned Voice Alert")
        verbose_name_plural = _("Tombstoned Voice Alerts")


class VoiceAlertBondedStatus(VoiceBase):
    setting = models.ForeignKey(
        AlertSettingBondedStatus,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alert_setting_bonded_status_voice",
        verbose_name=_("Bond Status Alert Settings"),
    )

    class Meta:
        verbose_name = _("Bond Status Voice Alert")
        verbose_name_plural = _("Bond Status Voice Alerts")
