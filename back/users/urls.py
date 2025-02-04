from django.urls import path

from users.views import (
    LoginView,
    RegisterView,
    RegisterConfirmView,
    LoginGoogleView,
    LogoutView,
    ResetPasswordView,
    ResetPasswordConfirmView,
    ProfileView,
    PasswordChangeView,
    EmailChangeView,
    EmailChangeConfirmView,
    CreateUserPhoneView,
    ResendUserPhoneConfirm,
    ConfirmUserPhoneView,
)


urlpatterns = [
    path("login/", LoginView.as_view()),
    path("register/", RegisterView.as_view()),
    path("register/confirm/", RegisterConfirmView.as_view()),
    path("login/google/", LoginGoogleView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("reset-password/", ResetPasswordView.as_view()),
    path("reset-password/confirm/", ResetPasswordConfirmView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("password-change/", PasswordChangeView.as_view()),
    path("email-change/", EmailChangeView.as_view()),
    path("email-change/confirm/", EmailChangeConfirmView.as_view()),
    path("phone/create/", CreateUserPhoneView.as_view()),
    path("phone/resend/<int:user_phone_id>/", ResendUserPhoneConfirm.as_view()),
    path("phone/confirm/", ConfirmUserPhoneView.as_view()),
]
