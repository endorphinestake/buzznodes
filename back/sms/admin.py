from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from sms.models import SMSAlert, SMSConfirm


@admin.register(SMSAlert)
class SMSAlertAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "display_phone",
        "sms_id",
        "short_text",
        "provider",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status", "provider", "user")
    search_fields = ("sms_id", "phone__phone", "sent_text")
    ordering = ("-created",)
    readonly_fields = ("updated", "created")

    @admin.display(description=_("Phone Number"))
    def display_phone(self, obj):
        return obj.phone.phone if obj.phone else "—"

    @admin.display(description=_("SMS Text"))
    def short_text(self, obj):
        return obj.sent_text[:50] + "..." if len(obj.sent_text) > 50 else obj.sent_text


@admin.register(SMSConfirm)
class SMSConfirmAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "display_phone",
        "sms_id",
        "short_text",
        "provider",
        "status",
        "code",
        "is_used",
        "expire_code",
        "updated",
        "created",
    )
    list_filter = ("status", "provider", "is_used", "user")
    search_fields = ("sms_id", "phone__phone", "sent_text", "code")
    ordering = ("-created",)
    readonly_fields = ("updated", "created")
    list_editable = ("is_used",)

    @admin.display(description=_("Phone Number"))
    def display_phone(self, obj):
        return obj.phone.phone if obj.phone else "—"

    @admin.display(description=_("SMS Text"))
    def short_text(self, obj):
        return obj.sent_text[:50] + "..." if len(obj.sent_text) > 50 else obj.sent_text
