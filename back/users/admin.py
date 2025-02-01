from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import Group
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from users.models import User, UserPhone


class UserPhoneInline(admin.TabularInline):
    model = UserPhone
    extra = 0
    fields = (
        "phone",
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
    inlines = (UserPhoneInline,)
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
        (
            _("Alerts"),
            {
                "fields": ("display_alert_settings",),
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
        "count_voting_power_alerts",
        "count_uptime_alerts",
        "count_commission_alerts",
        "count_jailed_alerts",
        "count_tombstoned_alerts",
        "last_login",
        "date_joined",
    )

    search_fields = ("email",)
    list_filter = ("register_type",)
    ordering = ("-id",)
    readonly_fields = ("display_alert_settings",)

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

    @admin.display(description=_("Alert Settings"))
    def display_alert_settings(self, obj):
        alert_settings = []

        for alert in obj.user_alert_settings_voting_power.all():
            alert_settings.append(
                f"🔹 Voting Power: {alert.setting} ({alert.current_value})"
            )

        for alert in obj.user_alert_settings_uptime.all():
            alert_settings.append(
                f"🔹 Uptime: {alert.setting} ({alert.current_value}%)"
            )

        for alert in obj.user_alert_settings_comission.all():
            alert_settings.append(
                f"🔹 Commission: {alert.setting} ({alert.current_value}%)"
            )

        for alert in obj.user_alert_settings_jailed_status.all():
            status = "Yes" if alert.current_value else "No"
            alert_settings.append(f"🔹 Jailed Status: {alert.setting} ({status})")

        for alert in obj.user_alert_settings_tombstoned_status.all():
            status = "Yes" if alert.current_value else "No"
            alert_settings.append(f"🔹 Tombstoned Status: {alert.setting} ({status})")

        if not alert_settings:
            return "—"

        return format_html("<br>".join(alert_settings))

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


admin.site.unregister(Group)
