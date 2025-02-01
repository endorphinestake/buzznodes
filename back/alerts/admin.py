from django.contrib import admin
from django.db.models import Count
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html

from alerts.models import (
    AlertSettingVotingPower,
    AlertSettingUptime,
    AlertSettingComission,
    AlertSettingJailedStatus,
    AlertSettingTombstonedStatus,
)


@admin.register(AlertSettingVotingPower)
class AlertSettingVotingPowerAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "formatted_values",
        "users_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_voting_power_user_settings")
        )

    @admin.display(description=_("Values"))
    def formatted_values(self, obj):
        value_from = f"{obj.value_from:,}".replace(",", " ")
        value_to = f"{obj.value_to:,}".replace(",", " ") if obj.value_to else "∞"
        values = f"{value_from} – {value_to}"
        return format_html('<span style="white-space: nowrap;">{}</span>', values)

    @admin.display(description=_("Users"))
    def users_count(self, obj):
        return obj.users_count


@admin.register(AlertSettingUptime)
class AlertSettingUptimeAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "formatted_values",
        "users_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_uptime_user_settings")
        )

    @admin.display(description=_("Values"))
    def formatted_values(self, obj):
        value_from = f"{obj.value_from}%"
        value_to = f"{obj.value_to}%" if obj.value_to else "∞"
        values = f"{value_from} – {value_to}"
        return format_html('<span style="white-space: nowrap;">{}</span>', values)

    @admin.display(description=_("Users"))
    def users_count(self, obj):
        return obj.users_count


@admin.register(AlertSettingComission)
class AlertSettingComissionAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "formatted_values",
        "users_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_comission_user_settings")
        )

    @admin.display(description=_("Values"))
    def formatted_values(self, obj):
        value_from = f"{obj.value_from}%"
        value_to = f"{obj.value_to}%" if obj.value_to else "∞"
        values = f"{value_from} – {value_to}"
        return format_html('<span style="white-space: nowrap;">{}</span>', values)

    @admin.display(description=_("Users"))
    def users_count(self, obj):
        return obj.users_count


@admin.register(AlertSettingJailedStatus)
class AlertSettingJailedAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "false_to_true",
        "true_to_false",
        "users_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_jailed_status_user_settings")
        )

    @admin.display(description=_("Users"))
    def users_count(self, obj):
        return obj.users_count


@admin.register(AlertSettingTombstonedStatus)
class AlertSettingTombstonedAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "false_to_true",
        "users_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_tombstoned_status_user_settings")
        )

    @admin.display(description=_("Users"))
    def users_count(self, obj):
        return obj.users_count
