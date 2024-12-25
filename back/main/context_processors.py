from django.conf import settings


def settings_vars(request):
    return {
        "PROJECT_NAME": settings.PROJECT_NAME,
        "BACKEND_URL": settings.BACKEND_URL,
        "FRONTEND_URL": settings.FRONTEND_URL,
        "EMAIL_SENDER_NAME": settings.EMAIL_SENDER_NAME,
        "LANG_CODE": (
            request.LANGUAGE_CODE.lower() if request else settings.LANGUAGE_CODE
        ),
    }
