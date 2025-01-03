from django.db import models
from django.utils.translation import gettext_lazy as _


class Blockchain(models.Model):
    status = models.BooleanField(default=True, verbose_name=_("Status"))
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    class Meta:
        verbose_name = _("Blockchain")
        verbose_name_plural = _("Blockchains")
