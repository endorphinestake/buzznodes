from decimal import Decimal

from django.db import models
from django.utils.translation import gettext_lazy as _


class Blockchain(models.Model):
    class Type(models.TextChoices):
        COSMOS = "cosmos", "Cosmos"

    btype = models.SlugField(
        choices=Type.choices, default=Type.COSMOS, verbose_name=_("Type")
    )
    status = models.BooleanField(db_index=True, default=True, verbose_name=_("Status"))
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.btype}"

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
    name = models.CharField(
        max_length=256, null=True, blank=True, verbose_name=_("Domain Name")
    )
    rpc_url = models.URLField(verbose_name=_("RPC URL"))
    validators_url = models.URLField(verbose_name=_("Validators URL"))
    infos_url = models.URLField(verbose_name=_("Signing Infos URL"))
    priority = models.PositiveIntegerField(db_index=True)
    status = models.BooleanField(default=True, verbose_name=_("Status"))
    total_called = models.PositiveBigIntegerField(verbose_name=_("Number of launches"))
    last_sync = models.DateTimeField(
        null=True, blank=True, verbose_name=_("Last Sync date")
    )
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.name}"

    class Meta:
        ordering = ["priority"]
        verbose_name = _("Blockchain URL")
        verbose_name_plural = _("Blockchain URLs")


class BlockchainValidator(models.Model):
    class Status(models.TextChoices):
        BOND_STATUS_UNSPECIFIED = "BOND_STATUS_UNSPECIFIED", "BOND_STATUS_UNSPECIFIED"
        BOND_STATUS_BONDED = "BOND_STATUS_BONDED", "BOND_STATUS_BONDED"
        BOND_STATUS_UNBONDED = "BOND_STATUS_UNBONDED", "BOND_STATUS_UNBONDED"
        BOND_STATUS_UNBONDING = "BOND_STATUS_UNBONDING", "BOND_STATUS_UNBONDING"

    blockchain = models.ForeignKey(
        Blockchain,
        on_delete=models.CASCADE,
        related_name="blockchain_validators",
        verbose_name=_("Blockchain"),
    )
    operator_address = models.CharField(
        db_index=True, max_length=255, verbose_name=_("Operator Address")
    )
    pubkey_type = models.CharField(
        max_length=255, verbose_name=_("Consensus pubkey @type")
    )
    pubkey_key = models.CharField(
        max_length=255, verbose_name=_("Consensus pubkey key")
    )
    moniker = models.CharField(
        db_index=True, null=True, blank=True, max_length=255, verbose_name=_("Moniker")
    )
    identity = models.CharField(
        null=True, blank=True, max_length=256, verbose_name=_("Identity")
    )
    picture = models.CharField(
        null=True, blank=True, max_length=256, verbose_name=_("Picture")
    )
    website = models.CharField(
        null=True, blank=True, max_length=256, verbose_name=_("Website")
    )
    contact = models.CharField(
        null=True, blank=True, max_length=256, verbose_name=_("Security Contact")
    )
    details = models.TextField(null=True, blank=True, verbose_name=_("Details"))
    voting_power = models.IntegerField(db_index=True, verbose_name=_("Voting Power"))
    commision_rate = models.DecimalField(max_digits=20, decimal_places=18)
    commision_max_rate = models.DecimalField(max_digits=20, decimal_places=18)
    commision_max_change_rate = models.DecimalField(max_digits=20, decimal_places=18)
    missed_blocks_counter = models.IntegerField()
    uptime = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("100.00"),
        verbose_name=_("Uptime, %"),
    )
    hex_address = models.CharField(
        max_length=255, null=True, blank=True, verbose_name=_("HEX Address")
    )
    valcons_address = models.CharField(
        max_length=255, null=True, blank=True, verbose_name=_("Valcons Address")
    )
    wallet_address = models.CharField(
        max_length=255, null=True, blank=True, verbose_name=_("Wallet Address")
    )
    jailed = models.BooleanField(default=False, verbose_name=_("Jailed"))
    tombstoned = models.BooleanField(default=False, verbose_name=_("Tombstoned status"))
    status = models.SlugField(
        max_length=25,
        choices=Status.choices,
        default=Status.BOND_STATUS_BONDED,
        verbose_name=_("Status"),
    )
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.moniker} ({self.blockchain})"

    class Meta:
        verbose_name = _("Blockchain Validator")
        verbose_name_plural = _("Blockchain Validators")
