from django.contrib import admin
from django.db.models import Count
from django.utils.translation import gettext_lazy as _

from alerts.models import (
    AlertSettingVotingPower,
    AlertSettingUptime,
    AlertSettingComission,
    AlertSettingJailedStatus,
    AlertSettingTombstonedStatus,
    AlertSettingBondedStatus,
    UserAlertSettingVotingPower,
    UserAlertSettingUptime,
    UserAlertSettingComission,
    UserAlertSettingJailedStatus,
    UserAlertSettingTombstonedStatus,
    UserAlertSettingBondedStatus,
)


class BaseUserAlertSettingInline(admin.TabularInline):
    extra = 0
    fields = (
        "id",
        "user",
        "blockchain_validator",
        "channels",
        "setting",
    )
    readonly_fields = (
        "user",
        "blockchain_validator",
        "setting",
    )


class UserAlertSettingVotingPowerInline(BaseUserAlertSettingInline):
    model = UserAlertSettingVotingPower


class UserAlertSettingUptimeInline(BaseUserAlertSettingInline):
    model = UserAlertSettingUptime


class UserAlertSettingComissionInline(BaseUserAlertSettingInline):
    model = UserAlertSettingComission


class UserAlertSettingTombstonedStatusInline(BaseUserAlertSettingInline):
    model = UserAlertSettingTombstonedStatus


class UserAlertSettingBondedStatusInline(BaseUserAlertSettingInline):
    model = UserAlertSettingBondedStatus


class UserAlertSettingJailedStatusInline(BaseUserAlertSettingInline):
    model = UserAlertSettingJailedStatus


@admin.register(AlertSettingVotingPower)
class AlertSettingVotingPowerAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingVotingPowerInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
        "voice_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_voting_power_user_settings"),
            sms_count=Count("alert_setting_voting_power_sms"),
            voice_count=Count("alert_setting_voting_power_voice"),
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count

    @admin.display(description=_("Sent Voice"))
    def voice_count(self, obj):
        return obj.voice_count


@admin.register(AlertSettingUptime)
class AlertSettingUptimeAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingUptimeInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
        "voice_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_uptime_user_settings"),
            sms_count=Count("alert_setting_uptime_sms"),
            voice_count=Count("alert_setting_uptime_voice"),
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count

    @admin.display(description=_("Sent Voice"))
    def voice_count(self, obj):
        return obj.voice_count


@admin.register(AlertSettingComission)
class AlertSettingComissionAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingComissionInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
        "voice_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_comission_user_settings"),
            sms_count=Count("alert_setting_comission_sms"),
            voice_count=Count("alert_setting_comission_voice"),
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count

    @admin.display(description=_("Sent Voice"))
    def voice_count(self, obj):
        return obj.voice_count


@admin.register(AlertSettingJailedStatus)
class AlertSettingJailedAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingJailedStatusInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
        "voice_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_jailed_status_user_settings"),
            sms_count=Count("alert_setting_jailed_status_sms"),
            voice_count=Count("alert_setting_jailed_status_voice"),
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count

    @admin.display(description=_("Sent Voice"))
    def voice_count(self, obj):
        return obj.voice_count


@admin.register(AlertSettingTombstonedStatus)
class AlertSettingTombstonedAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingTombstonedStatusInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
        "voice_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_tombstoned_status_user_settings"),
            sms_count=Count("alert_setting_tombstoned_status_sms"),
            voice_count=Count("alert_setting_tombstoned_status_voice"),
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count

    @admin.display(description=_("Sent Voice"))
    def voice_count(self, obj):
        return obj.voice_count


@admin.register(AlertSettingBondedStatus)
class AlertSettingBondedAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingBondedStatusInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
        "voice_count",
        "status",
        "updated",
        "created",
    )
    list_filter = ("status",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            users_count=Count("alert_setting_bonded_status_user_settings"),
            sms_count=Count("alert_setting_bonded_status_sms"),
            voice_count=Count("alert_setting_bonded_status_voice"),
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count

    @admin.display(description=_("Sent Voice"))
    def voice_count(self, obj):
        return obj.voice_count
