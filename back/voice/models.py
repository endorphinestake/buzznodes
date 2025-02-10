from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import User, UserPhone


class VoiceBase(models.Model):
    class VType(models.TextChoices):
        ALERT = "ALERT", _("Alert")

    class Provider(models.TextChoices):
        MAIN = "MAIN", _("Main (Unitalk.cloud)")
        RESERVE1 = "RESERVE1", _("Reserve (Bird)")

    class Status(models.TextChoices):
        NEW = "NEW", _("New")
        ERROR = "ERROR", _("Error")

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
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.phone} -> {self.sent_text[:50]}"

    class Meta:
        abstract = True
