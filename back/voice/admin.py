from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from voice.models import (
    VoiceAlertVotingPower,
    VoiceAlertUptime,
    VoiceAlertComission,
    VoiceAlertJailedStatus,
    VoiceAlertTombstonedStatus,
    VoiceAlertBondedStatus,
    VoiceAlertOtelUpdate,
    VoiceAlertSyncStatus,
)


class VoiceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "display_phone",
        "voice_id",
        "short_text",
        "provider",
        "status",
        "created",
    )
    list_filter = ("status", "provider", "created")
    search_fields = ("voice_id", "phone__phone", "sent_text")
    ordering = ("-id",)
    readonly_fields = ("updated", "created")

    @admin.display(description=_("Phone Number"))
    def display_phone(self, obj):
        return obj.phone.phone if obj.phone else "—"

    @admin.display(description=_("Voice Text"))
    def short_text(self, obj):
        return obj.sent_text[:50] + "..." if len(obj.sent_text) > 50 else obj.sent_text


admin.site.register(VoiceAlertVotingPower, VoiceAdmin)
admin.site.register(VoiceAlertUptime, VoiceAdmin)
admin.site.register(VoiceAlertComission, VoiceAdmin)
admin.site.register(VoiceAlertJailedStatus, VoiceAdmin)
admin.site.register(VoiceAlertTombstonedStatus, VoiceAdmin)
admin.site.register(VoiceAlertBondedStatus, VoiceAdmin)
admin.site.register(VoiceAlertOtelUpdate, VoiceAdmin)
admin.site.register(VoiceAlertSyncStatus, VoiceAdmin)
