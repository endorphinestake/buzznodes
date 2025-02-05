from django_ckeditor_5.fields import CKEditor5Field

from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import User


class BaseAlertEmail(models.Model):
    class EmailStatus(models.TextChoices):
        NEW = "NEW", _("New")
        SENT = "SENT", _("Sent")
        ERROR = "ERROR", _("Error")

    class Meta:
        abstract = True


class AlertConfirmEmail(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_alert_confirm_emails",
        verbose_name=_("User"),
    )
    user_alert_setting_id = models.IntegerField(verbose_name=_("User Alert Setting ID"))
    subject = models.CharField(max_length=256, verbose_name=_("Email Subject"))
    email_html = CKEditor5Field(verbose_name=_("Email content"))
    code = models.CharField(
        db_index=True, max_length=255, verbose_name=_("Confirmation code")
    )
    is_used = models.BooleanField(default=False, verbose_name=_("Used"))
    status = models.CharField(
        max_length=25,
        choices=BaseAlertEmail.EmailStatus.choices,
        default=BaseAlertEmail.EmailStatus.NEW,
        verbose_name=_("Sending Status"),
    )
    err = models.TextField(null=True, blank=True, verbose_name=_("Error Details"))
    expire_code = models.DateTimeField(
        db_index=True,
        null=True,
        blank=True,
        verbose_name=_("Code expiration date"),
    )
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.user} - {self.subject}"

    class Meta:
        verbose_name = _("Alert Confirm Email")
        verbose_name_plural = _("Alert Confirm Emails")


class Contact(models.Model):
    name = models.CharField(max_length=256)
    email = models.EmailField()
    phone = models.CharField(max_length=256, null=True, blank=True)
    subject = models.CharField(max_length=256, blank=True, null=True)
    message = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Contact Form")
        verbose_name_plural = _("Contact Forms")
