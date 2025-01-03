from adminsortable2.admin import SortableAdminBase, SortableInlineAdminMixin

from django.contrib import admin

from blockchains.models import Blockchain, BlockchainUrl, BlockchainValidator


class BlockchainUrlInline(SortableInlineAdminMixin, admin.TabularInline):
    model = BlockchainUrl
    extra = 0
    fields = (
        "url",
        "priority",
        "status",
        "last_sync",
        "updated",
        "created",
    )
    readonly_fields = (
        "last_sync",
        "updated",
        "created",
    )
    ordering = ("priority",)


@admin.register(Blockchain)
class BlockchainAdmin(SortableAdminBase, admin.ModelAdmin):
    inlines = (BlockchainUrlInline,)
    list_display = (
        "btype",
        "status",
        "updated",
        "created",
    )
    list_filter = ("btype",)


# @admin.register(BlockchainUrl)
# class BlockchainUrlAdmin(SortableAdminMixin, admin.ModelAdmin):
#     list_display = (
#         "blockchain",
#         "url",
#         "priority",
#         "status",
#         "last_sync",
#         "updated",
#         "created",
#     )
#     list_filter = ("blockchain",)
#     ordering = ("priority",)


@admin.register(BlockchainValidator)
class BlockchainValidatorAdmin(admin.ModelAdmin):
    list_display = (
        "blockchain",
        "operator_address",
        "moniker",
        "website",
        "contact",
        "updated",
        "created",
    )
    list_filter = ("blockchain",)
    search_fields = (
        "operator_address",
        "moniker",
    )
