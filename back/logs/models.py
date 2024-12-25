from django.db import models
from django.utils.translation import gettext_lazy as _

from asgiref.sync import sync_to_async


class Log(models.Model):
    class LogLevel(models.TextChoices):
        INFO = "info", "Info"
        WARNING = "warning", "Warning"
        ERROR = "error", "Error"

    level = models.SlugField(
        choices=LogLevel.choices, default=LogLevel.INFO, verbose_name=_("Log Level")
    )
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self) -> str:
        return self.level

    @staticmethod
    def info(text: str):
        return Log.objects.create(level=Log.LogLevel.INFO, text=text)

    @staticmethod
    def warning(text: str):
        print("WARNING: ", text)
        return Log.objects.create(level=Log.LogLevel.WARNING, text=text)

    @staticmethod
    def error(text: str):
        print("ERROR: ", text)
        return Log.objects.create(level=Log.LogLevel.ERROR, text=text)

    @staticmethod
    @sync_to_async
    def ainfo(text: str):
        return Log.info(text)

    @staticmethod
    @sync_to_async
    def awarning(text: str):
        return Log.warning(text)

    @staticmethod
    @sync_to_async
    def aerror(text: str):
        return Log.error(text)

    class Meta:
        verbose_name = _("Log")
        verbose_name_plural = _("Logs")
