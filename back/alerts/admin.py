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


class UserAlertSettingVotingPowerInline(admin.TabularInline):
    model = UserAlertSettingVotingPower
    extra = 0


class UserAlertSettingUptimeInline(admin.TabularInline):
    model = UserAlertSettingUptime
    extra = 0


class UserAlertSettingComissionInline(admin.TabularInline):
    model = UserAlertSettingComission
    extra = 0


class UserAlertSettingTombstonedStatusInline(admin.TabularInline):
    model = UserAlertSettingTombstonedStatus
    extra = 0


class UserAlertSettingBondedStatusInline(admin.TabularInline):
    model = UserAlertSettingBondedStatus
    extra = 0


class UserAlertSettingJailedStatusInline(admin.TabularInline):
    model = UserAlertSettingJailedStatus
    extra = 0


@admin.register(AlertSettingVotingPower)
class AlertSettingVotingPowerAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingVotingPowerInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
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
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count


@admin.register(AlertSettingUptime)
class AlertSettingUptimeAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingUptimeInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
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
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count


@admin.register(AlertSettingComission)
class AlertSettingComissionAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingComissionInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
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
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count


@admin.register(AlertSettingJailedStatus)
class AlertSettingJailedAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingJailedStatusInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
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
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count


@admin.register(AlertSettingTombstonedStatus)
class AlertSettingTombstonedAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingTombstonedStatusInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
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
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count


@admin.register(AlertSettingBondedStatus)
class AlertSettingBondedAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingBondedStatusInline,)
    list_display = (
        "__str__",
        "value",
        "users_count",
        "sms_count",
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
        )

    @admin.display(description=_("Uses Users"))
    def users_count(self, obj):
        return obj.users_count

    @admin.display(description=_("Sent SMS"))
    def sms_count(self, obj):
        return obj.sms_count
