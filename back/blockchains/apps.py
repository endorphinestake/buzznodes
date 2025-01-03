from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class BlockchainsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "blockchains"
    verbose_name = _("Blockchains")
