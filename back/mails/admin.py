from django.contrib import admin


from mails.models import AlertConfirmEmail, Contact


@admin.register(AlertConfirmEmail)
class AlertConfirmEmailAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "user_alert_setting_id",
        "subject",
        "code",
        "is_used",
        "status",
        "expire_code",
        "updated",
        "created",
    )


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "subject",
        "created",
    )
