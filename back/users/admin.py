from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import Group
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from users.models import User, UserPhone
from alerts.models import (
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
        "blockchain_validator",
        "channels",
        "setting",
    )
    readonly_fields = (
        "blockchain_validator",
        "setting",
    )

    def get_fields(self, request, obj=None):
        fields = list(super().get_fields(request, obj))
        if obj and hasattr(obj, "current_value"):
            fields.append("current_value")
        return fields


class UserAlertSettingVotingPowerInline(BaseUserAlertSettingInline):
    model = UserAlertSettingVotingPower


class UserAlertSettingUptimeInline(BaseUserAlertSettingInline):
    model = UserAlertSettingUptime


class UserAlertSettingComissionInline(BaseUserAlertSettingInline):
    model = UserAlertSettingComission


class UserAlertSettingJailedStatusInline(BaseUserAlertSettingInline):
    model = UserAlertSettingJailedStatus


class UserAlertSettingTombstonedStatusInline(BaseUserAlertSettingInline):
    model = UserAlertSettingTombstonedStatus


class UserAlertSettingBondedStatusInline(BaseUserAlertSettingInline):
    model = UserAlertSettingBondedStatus


class UserAlertSettingOtelUpdateInline(BaseUserAlertSettingInline):
    model = UserAlertSettingOtelUpdate
    fields = BaseUserAlertSettingInline.fields + ("moniker",)


class UserAlertSettingSyncStatusInline(BaseUserAlertSettingInline):
    model = UserAlertSettingSyncStatus
    fields = BaseUserAlertSettingInline.fields + ("moniker",)


class UserPhoneInline(admin.TabularInline):
    model = UserPhone
    extra = 0
    fields = (
        "phone",
        "is_tested_voice",
        "status",
        "updated",
        "created",
    )
    readonly_fields = (
        "updated",
        "created",
    )


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    inlines = (
        UserPhoneInline,
        UserAlertSettingVotingPowerInline,
        UserAlertSettingUptimeInline,
        UserAlertSettingComissionInline,
        UserAlertSettingJailedStatusInline,
        UserAlertSettingTombstonedStatusInline,
        UserAlertSettingBondedStatusInline,
        UserAlertSettingOtelUpdateInline,
        UserAlertSettingSyncStatusInline,
    )
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal info"),
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "register_type",
                    "locale",
                )
            },
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )

    list_display = (
        "id",
        "email",
        "register_type",
        "locale",
        "is_active",
        "display_user_phones",
        "phones_count",
        "count_voting_power_alerts",
        "count_uptime_alerts",
        "count_commission_alerts",
        "count_jailed_alerts",
        "count_tombstoned_alerts",
        "count_otel_alerts",
        "count_sync_alerts",
        "last_login",
        "date_joined",
    )

    search_fields = ("email",)
    list_filter = ("register_type",)
    ordering = ("-id",)

    @admin.display(description=_("User Phones"))
    def display_user_phones(self, obj):
        phones = obj.user_phones.all()
        if not phones:
            return "—"
        return format_html(
            '<span style="white-space: nowrap;">{}</span>',
            ", ".join(
                f"{'✅' if phone.status else '❌'}{phone.phone}" for phone in phones
            ),
        )

    @admin.display(description=_("Voting Power Alerts"))
    def count_voting_power_alerts(self, obj):
        return obj.user_alert_settings_voting_power.count()

    @admin.display(description=_("Uptime Alerts"))
    def count_uptime_alerts(self, obj):
        return obj.user_alert_settings_uptime.count()

    @admin.display(description=_("Commission Alerts"))
    def count_commission_alerts(self, obj):
        return obj.user_alert_settings_comission.count()

    @admin.display(description=_("Jailed Alerts"))
    def count_jailed_alerts(self, obj):
        return obj.user_alert_settings_jailed_status.count()

    @admin.display(description=_("Tombstoned Alerts"))
    def count_tombstoned_alerts(self, obj):
        return obj.user_alert_settings_tombstoned_status.count()

    @admin.display(description=_("Otel Update Alerts"))
    def count_otel_alerts(self, obj):
        return obj.user_alert_settings_otel_update.count()

    @admin.display(description=_("Sync Status Alerts"))
    def count_sync_alerts(self, obj):
        return obj.user_alert_settings_sync_status.count()


admin.site.unregister(Group)
