from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class VoiceConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "voice"
    verbose_name = _("Voice")
