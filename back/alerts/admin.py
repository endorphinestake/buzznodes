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
    AlertSettingOtelUpdate,
    AlertSettingSyncStatus,
    UserAlertSettingVotingPower,
    UserAlertSettingUptime,
    UserAlertSettingComission,
    UserAlertSettingJailedStatus,
    UserAlertSettingTombstonedStatus,
    UserAlertSettingBondedStatus,
    UserAlertSettingOtelUpdate,
    UserAlertSettingSyncStatus,
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


class UserAlertSettingOtelUpdateInline(BaseUserAlertSettingInline):
    model = UserAlertSettingOtelUpdate
    fields = BaseUserAlertSettingInline.fields + ("moniker",)


class UserAlertSettingSyncStatusInline(BaseUserAlertSettingInline):
    model = UserAlertSettingSyncStatus
    fields = BaseUserAlertSettingInline.fields + ("moniker",)


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
            users_count=Count(
                "alert_setting_voting_power_user_settings", distinct=True
            ),
            sms_count=Count("alert_setting_voting_power_sms", distinct=True),
            voice_count=Count("alert_setting_voting_power_voice", distinct=True),
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
            users_count=Count("alert_setting_uptime_user_settings", distinct=True),
            sms_count=Count("alert_setting_uptime_sms", distinct=True),
            voice_count=Count("alert_setting_uptime_voice", distinct=True),
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
            users_count=Count("alert_setting_comission_user_settings", distinct=True),
            sms_count=Count("alert_setting_comission_sms", distinct=True),
            voice_count=Count("alert_setting_comission_voice", distinct=True),
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
            users_count=Count(
                "alert_setting_jailed_status_user_settings", distinct=True
            ),
            sms_count=Count("alert_setting_jailed_status_sms", distinct=True),
            voice_count=Count("alert_setting_jailed_status_voice", distinct=True),
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
            users_count=Count(
                "alert_setting_tombstoned_status_user_settings", distinct=True
            ),
            sms_count=Count("alert_setting_tombstoned_status_sms", distinct=True),
            voice_count=Count("alert_setting_tombstoned_status_voice", distinct=True),
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
            users_count=Count(
                "alert_setting_bonded_status_user_settings", distinct=True
            ),
            sms_count=Count("alert_setting_bonded_status_sms", distinct=True),
            voice_count=Count("alert_setting_bonded_status_voice", distinct=True),
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


@admin.register(AlertSettingOtelUpdate)
class AlertSettingOtelUpdateAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingOtelUpdateInline,)
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
            users_count=Count("alert_setting_otel_update_user_settings", distinct=True),
            sms_count=Count("alert_setting_otel_update_sms", distinct=True),
            voice_count=Count("alert_setting_otel_update_voice", distinct=True),
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


@admin.register(AlertSettingSyncStatus)
class AlertSettingSyncStatusAdmin(admin.ModelAdmin):
    inlines = (UserAlertSettingSyncStatusInline,)
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
            users_count=Count("alert_setting_sync_status_user_settings", distinct=True),
            sms_count=Count("alert_setting_sync_status_sms", distinct=True),
            voice_count=Count("alert_setting_sync_status_voice", distinct=True),
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
