from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.utils.http import urlencode

from main.context_processors import settings_vars

from django_rq import job

context = settings_vars(None)


@job("submit_email")
def send_verification_mail(email: str, password: str, token: str, domain: str | None):
    if domain:
        domain = f"https://{domain}"
    else:
        domain = settings.FRONTEND_URL

    html_message = render_to_string(
        "emails/email_verification.html",
        {
            "email": email,
            "password": password,
            "confirm_link": f"{domain}/register-confirm?{urlencode({'token': token})}",
            **context,
        },
    )

    send_mail(
        subject=_("Registration Confirmation"),
        from_email=settings.EMAIL_SENDER_NAME,
        message=None,
        recipient_list=[email],
        html_message=html_message,
    )


@job("submit_email")
def send_credentials_mail(email: str, password: str):
    html_message = render_to_string(
        "emails/email_credentials.html",
        {
            "email": email,
            "password": password,
            "login_link": f"{settings.FRONTEND_URL}/login",
            **context,
        },
    )

    send_mail(
        subject=_("Credentials for new account"),
        from_email=settings.EMAIL_SENDER_NAME,
        message=None,
        recipient_list=[email],
        html_message=html_message,
    )


@job("submit_email")
def send_reset_password_mail(email: str, token: str):
    html_message = render_to_string(
        "emails/email_reset_password.html",
        {
            "reset_link": f"{settings.FRONTEND_URL}/reset-password-confirm?{urlencode({'token': token})}",
            **context,
        },
    )

    send_mail(
        subject=_("Password reset requested"),
        from_email=settings.EMAIL_SENDER_NAME,
        message=None,
        recipient_list=[email],
        html_message=html_message,
    )


@job("submit_email")
def send_changed_password(email: str, new_password: str):
    html_message = render_to_string(
        "emails/email_changed_password.html",
        {"email": email, "password": new_password, **context},
    )

    send_mail(
        subject=_("Your password was successfully changed!"),
        from_email=settings.EMAIL_SENDER_NAME,
        message=None,
        recipient_list=[email],
        html_message=html_message,
    )


@job("submit_email")
def send_change_email_mail(request, user, new_email):
    user.tmp_email = new_email
    user.token = default_token_generator.make_token(user)
    user.save()

    html_message = render_to_string(
        "emails/email_change_email.html",
        {"reset_link": f"/changemail/confirm/?token={user.token}"},
        request=request,
    )

    send_mail(
        subject=_("Request to change your email"),
        from_email=settings.EMAIL_SENDER_NAME,
        message=None,
        recipient_list=[user.email],
        html_message=html_message,
    )
