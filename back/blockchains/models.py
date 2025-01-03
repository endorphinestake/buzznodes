from django.db import models
from django.utils.translation import gettext_lazy as _


class Blockchain(models.Model):
    class Type(models.TextChoices):
        COSMOS = "cosmos", "Cosmos"

    btype = models.SlugField(
        choices=Type.choices, default=Type.COSMOS, verbose_name=_("Type")
    )
    status = models.BooleanField(default=True, verbose_name=_("Status"))
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.btype} ({self.status})"

    class Meta:
        verbose_name = _("Blockchain")
        verbose_name_plural = _("Blockchains")


class BlockchainUrl(models.Model):
    blockchain = models.ForeignKey(
        Blockchain,
        on_delete=models.CASCADE,
        related_name="blockchain_urls",
        verbose_name=_("Blockchain"),
    )
    url = models.URLField(verbose_name=_("API URL"))
    priority = models.PositiveIntegerField(db_index=True)
    status = models.BooleanField(default=True, verbose_name=_("Status"))
    last_sync = models.DateTimeField(
        null=True, blank=True, verbose_name=_("Last Sync date")
    )
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.url} ({self.status})"

    class Meta:
        ordering = ["priority"]
        verbose_name = _("Blockchain URL")
        verbose_name_plural = _("Blockchain URLs")


class BlockchainValidator(models.Model):
    blockchain = models.ForeignKey(
        Blockchain,
        on_delete=models.CASCADE,
        related_name="blockchain_validators",
        verbose_name=_("Blockchain"),
    )
    operator_address = models.CharField(
        db_index=True, max_length=255, verbose_name=_("Operator Address")
    )
    moniker = models.CharField(db_index=True, max_length=255, verbose_name=_("Moniker"))
    identity = models.CharField(
        null=True, blank=True, max_length=256, verbose_name=_("Identity")
    )
    website = models.CharField(
        null=True, blank=True, max_length=256, verbose_name=_("Website")
    )
    contact = models.CharField(
        null=True, blank=True, max_length=256, verbose_name=_("Security Contact")
    )
    details = models.TextField(null=True, blank=True, verbose_name=_("Details"))
    status = models.BooleanField(default=True, verbose_name=_("Status"))
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.moniker} ({self.status})"

    class Meta:
        verbose_name = _("Blockchain Validator")
        verbose_name_plural = _("Blockchain Validators")
