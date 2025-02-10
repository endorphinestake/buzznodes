from django.contrib import admin

from voice.models import (
    VoiceAlertVotingPower,
    VoiceAlertUptime,
    VoiceAlertComission,
    VoiceAlertJailedStatus,
    VoiceAlertTombstonedStatus,
    VoiceAlertBondedStatus,
)


class VoiceAdmin(admin.ModelAdmin):
    list_display = ("user", "phone", "sent_text", "provider", "status", "created")
    list_filter = ("status", "provider", "created")
    search_fields = ("phone__number", "sent_text", "voice_id")


admin.site.register(VoiceAlertVotingPower, VoiceAdmin)
admin.site.register(VoiceAlertUptime, VoiceAdmin)
admin.site.register(VoiceAlertComission, VoiceAdmin)
admin.site.register(VoiceAlertJailedStatus, VoiceAdmin)
admin.site.register(VoiceAlertTombstonedStatus, VoiceAdmin)
admin.site.register(VoiceAlertBondedStatus, VoiceAdmin)
