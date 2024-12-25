from django.contrib import admin
from django.utils.translation import gettext_lazy as _


from logs.models import Log


@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "level",
        "display_text",
        "created",
    )
    list_filter = ("level",)

    def display_text(self, obj):
        return f"{obj.text[:50]}..."

    display_text.short_description = _("Text")
