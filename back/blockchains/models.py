from decimal import Decimal

from django.db import models
from django.utils.translation import gettext_lazy as _


class Blockchain(models.Model):
    class Type(models.TextChoices):
        COSMOS = "cosmos", "Cosmos"

    class NetworkType(models.TextChoices):
        CELESTIA_TESTNET = "CELESTIA_TESTNET", _("Celestia Testnet")
        CELESTIA_MAINNET = "CELESTIA_MAINNET", _("Celestia Mainnet")
        OG_TESTNET = "OG_TESTNET", _("0g Testnet")
        OG_MAINNET = "OG_MAINNET", _("0g Mainnet")
        XRPL_TESTNET = "XRPL_TESTNET", _("XRP Ledger Testnet")
        XRPL_MAINNET = "XRPL_MAINNET", _("XRP Ledger Mainnet")
        STORY_TESTNET = "STORY_TESTNET", _("Story Testnet")
        STORY_MAINNET = "STORY_MAINNET", _("Story Mainnet")

    class ChartType(models.TextChoices):
        COSMOS_UPTIME = "cosmos_validator_uptime", "Cosmos Uptime"
        COSMOS_VOTING_POWER = "cosmos_validator_voting_power", "Cosmos Voting Power"
        COSMOS_COMISSION = "cosmos_validator_commission_rate", "Cosmos Comission"

    class ChartPeriod(models.TextChoices):
        H1 = "h1", _("1 Hour")
        H24 = "24h", _("1 Day")
        D7 = "7d", _("7 Days")
        D30 = "30d", _("1 Month")

    class ChartStep(models.TextChoices):
        S25 = "25s", "25s"
        M10 = "10m", "10m"
        H1 = "1h", "1h"
        H4 = "4h", "4h"

    btype = models.SlugField(
        choices=Type.choices, default=Type.COSMOS, verbose_name=_("Type")
    )
    ntype = models.SlugField(
        choices=NetworkType.choices,
        default=NetworkType.CELESTIA_TESTNET,
        verbose_name=_("Network Type"),
    )
    name = models.CharField(
        max_length=256, default="Celestia Mainnet", verbose_name=_("Blockchain Name")
    )
    da_url = models.CharField(
        max_length=256, null=True, blank=True, verbose_name=_("DA Metrics URL")
    )
    network_height = models.BigIntegerField(default=0, verbose_name=_("Network Height"))
    status = models.BooleanField(db_index=True, default=True, verbose_name=_("Status"))
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.name}"

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
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.name}"

    class Meta:
        ordering = ["priority"]
        verbose_name = _("Blockchain Validator URL")
        verbose_name_plural = _("Blockchain Validator URLs")


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


class BlockchainBridge(models.Model):
    blockchain = models.ForeignKey(
        Blockchain,
        on_delete=models.CASCADE,
        related_name="blockchain_bridges",
        verbose_name=_("Blockchain"),
    )
    node_id = models.CharField(db_index=True, max_length=255, verbose_name=_("Node ID"))
    version = models.CharField(max_length=255, verbose_name=_("Version"))
    system_version = models.CharField(max_length=255, verbose_name=_("System Version"))
    node_height = models.PositiveBigIntegerField(
        db_index=True, verbose_name=_("Current Node Height")
    )
    node_height_diff = models.PositiveBigIntegerField(
        default=0, verbose_name=_("The diff between Network height")
    )
    last_timestamp = models.PositiveBigIntegerField(
        db_index=True, default=0, verbose_name=_("Last timestamp pfb total")
    )
    last_timestamp_diff = models.PositiveBigIntegerField(
        default=0, verbose_name=_("Last timestamp diff (seconds)")
    )
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.node_id} ({self.blockchain})"

    class Meta:
        verbose_name = _("Blockchain Bridge")
        verbose_name_plural = _("Blockchain Bridges")
