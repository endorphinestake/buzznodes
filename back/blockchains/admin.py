from adminsortable2.admin import SortableAdminBase, SortableInlineAdminMixin

from django.contrib import admin

from blockchains.models import (
    Blockchain,
    BlockchainUrl,
    BlockchainValidator,
    BlockchainBridge,
)


class BlockchainUrlInline(SortableInlineAdminMixin, admin.StackedInline):
    model = BlockchainUrl
    extra = 0
    fields = (
        "name",
        "rpc_url",
        "validators_url",
        "infos_url",
        "priority",
        "status",
        "updated",
        "created",
    )
    readonly_fields = (
        "updated",
        "created",
    )
    ordering = ("priority",)


@admin.register(Blockchain)
class BlockchainAdmin(SortableAdminBase, admin.ModelAdmin):
    inlines = (BlockchainUrlInline,)
    list_display = (
        "name",
        "btype",
        "da_url",
        "status",
        "updated",
        "created",
    )
    list_filter = ("btype",)

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(BlockchainValidator)
class BlockchainValidatorAdmin(admin.ModelAdmin):
    list_display = (
        "moniker",
        "status",
        "voting_power",
        "uptime",
        "missed_blocks_counter",
        "commision_rate",
        "commision_max_rate",
        "commision_max_change_rate",
        "website",
        "contact",
        "jailed",
        "tombstoned",
        "updated",
        "created",
    )
    list_filter = (
        "blockchain",
        "status",
        "jailed",
        "tombstoned",
    )
    search_fields = (
        "operator_address",
        "moniker",
        "pubkey_key",
        "hex_address",
        "valcons_address",
        "wallet_address",
    )

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(BlockchainBridge)
class BlockchainBridgeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "blockchain",
        "node_id",
        "version",
        "system_version",
        "node_height",
        "last_timestamp",
        "updated",
        "created",
    )

    list_filter = ("blockchain",)
    search_fields = ("node_id",)

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False
