from django.db import models
from django.utils.translation import gettext_lazy as _


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
