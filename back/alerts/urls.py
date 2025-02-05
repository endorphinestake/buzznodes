from django.urls import path


from alerts.views import (
    AlertSettingsView,
    UserAlertSettingsView,
    UserAlertManageSettingsView,
)


urlpatterns = [
    path("settings/", AlertSettingsView.as_view()),
    path("user-settings/", UserAlertSettingsView.as_view()),
    path("user-settings/manage/", UserAlertManageSettingsView.as_view()),
]
