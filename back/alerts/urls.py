from django.urls import path


from alerts.views import (
    AlertSettingsView,
    UserAlertSettingsView,
    UserAlertManageSettingsView,
    UserAlertsHistoryView,
)


urlpatterns = [
    path("settings/", AlertSettingsView.as_view()),
    path("user-settings/<int:blockchain_id>/", UserAlertSettingsView.as_view()),
    path("user-settings/manage/", UserAlertManageSettingsView.as_view()),
    path("history/", UserAlertsHistoryView.as_view()),
]
