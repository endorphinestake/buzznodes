"""
Django settings for main project.

Generated by 'django-admin startproject' using Django 5.0.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

import os
import environ
from pathlib import Path
from django.utils.timezone import timedelta

env = environ.Env(DEBUG=(bool, False))


BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

DEBUG = env.bool("DEBUG")
SECRET_KEY = env.str("SECRET_KEY")
PROJECT_NAME = env.str("PROJECT_NAME")
BACKEND_URL = env.str("BACKEND_URL")
FRONTEND_URL = env.str("FRONTEND_URL")

ADMINS = (("Tokatak", "vshevtsov17@gmail.com"),)

ALLOWED_HOSTS = ["*"]
CSRF_COOKIE_NAME = "csrftoken"
CSRF_HEADER_NAME = "HTTP_X_CSRFTOKEN"
SESSION_COOKIE_DOMAIN = env.str("SESSION_COOKIE_DOMAIN")
CSRF_COOKIE_DOMAIN = env.str("SESSION_COOKIE_DOMAIN")
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    # DEV
    "http://celestia.local.com:3000",
    "http://celestia-testnet.local.com:3000",
    # PROD
    "https://buzznodes.com",
    "https://celestia.buzznodes.com",
    "https://celestia-testnet.buzznodes.com",
    "https://0g.buzznodes.com",
    "https://xrpl-testnet.buzznodes.com",
    "https://xrpl.buzznodes.com",
    "https://story-testnet.buzznodes.com",
]
CSRF_TRUSTED_ORIGINS = [
    # DEV
    "http://celestia.local.com:3000",
    "http://celestia-testnet.local.com:3000",
    # PROD
    "https://buzznodes.com",
    "https://celestia.buzznodes.com",
    "https://celestia-testnet.buzznodes.com",
    "https://0g.buzznodes.com",
    "https://xrpl-testnet.buzznodes.com",
    "https://xrpl.buzznodes.com",
    "https://story-testnet.buzznodes.com",
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "django_rq",
    "rosetta",
    "django_ckeditor_5",
    "adminsortable2",
    "main.apps.MainConfig",
    "users.apps.UsersConfig",
    "mails.apps.MailsConfig",
    "logs.apps.LogsConfig",
    "blockchains.apps.BlockchainsConfig",
    "alerts.apps.AlertsConfig",
    "sms.apps.SmsConfig",
    "voice.apps.VoiceConfig",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "main.middlewares.DjanoGZipMiddleware",
]

ROOT_URLCONF = "main.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "main.context_processors.settings_vars",
            ],
        },
    },
]

WSGI_APPLICATION = "main.wsgi.application"


DATABASES = {
    "default": {
        **env.db_url(var="DATABASE_URL"),
        "OPTIONS": {
            "charset": "utf8mb4",
            "connect_timeout": 10,
            "read_timeout": 10,
            "write_timeout": 10,
        },
        "CONN_MAX_AGE": 600,
    }
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

RQ_QUEUES = {
    "submit_voice": {
        "HOST": "localhost",
        "PORT": 6379,
        "DB": 0,
        "PASSWORD": "",
        "DEFAULT_TIMEOUT": 360,
    },
    "submit_sms": {
        "HOST": "localhost",
        "PORT": 6379,
        "DB": 1,
        "PASSWORD": "",
        "DEFAULT_TIMEOUT": 360,
    },
    "submit_email": {
        "HOST": "localhost",
        "PORT": 6379,
        "DB": 2,
        "PASSWORD": "",
        "DEFAULT_TIMEOUT": 360,
    },
    "alerts": {
        "HOST": "localhost",
        "PORT": 6379,
        "DB": 3,
        "PASSWORD": "",
        "DEFAULT_TIMEOUT": 360,
    },
}

AUTH_USER_MODEL = "users.User"

PASSWORD_RESET_TIMEOUT = 60 * 60 * 72  # 3 days

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

USE_I18N = True
LANGUAGE_CODE = "en"
LANGUAGES = (
    ("en", "English"),
    # ('ru', 'Русский'),
)

USE_TZ = True
TIME_ZONE = "UTC"
DATE_FORMAT = "j F, Y"

LOCALE_PATHS = [
    os.path.join(BASE_DIR, "locale/"),
]

STATIC_URL = "/static/"

if DEBUG:
    STATICFILES_DIRS = [
        os.path.join(BASE_DIR, "static/"),
    ]
else:
    STATIC_ROOT = os.path.join(BASE_DIR, "static/")


MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media/")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env.str("EMAIL_HOST")
EMAIL_PORT = env.int("EMAIL_PORT")
EMAIL_HOST_USER = env.str("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env.str("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS")
EMAIL_USE_SSL = env.bool("EMAIL_USE_SSL")
EMAIL_SENDER_NAME = env.str("EMAIL_SENDER_NAME")

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
}

DEFAULT_PAGE_SIZE = 25

EXPIRED_LOGS_PERIOD = timedelta(days=30)
METRICS_CHART_MAX_PERIOD = timedelta(days=30)
PHONE_NUMBER_CODE_EXPIRED = timedelta(hours=24)
PHONE_NUMBER_CODE_SMS_TEXT = "{code} is your BuzzNodes verification code"
RETRIES_CONFIRM_SMS_CODE_PERIOD = timedelta(minutes=1)
MAX_RETRIES_CONFIRM_PHONE_SMS = 1
MAX_RETRIES_USER_PHONE_CREATE = 1

METRICS_ALLOWED_IPS = ["127.0.0.1", "37.27.90.63", "65.21.148.247"]
METRICS_TIMEOUT_SECONDS = 2

GRAFANA_BASE_URL = env.str("GRAFANA_BASE_URL")
GRAFANA_SERVICE_TOKEN = env.str("GRAFANA_SERVICE_TOKEN")

HICELL_SMS_USERNAME = env.str("HICELL_SMS_USERNAME")
HICELL_SMS_API_KEY = env.str("HICELL_SMS_API_KEY")
BIRD_ACCESS_KEY = env.str("BIRD_ACCESS_KEY")
BIRD_WORKSPACE_ID = env.str("BIRD_WORKSPACE_ID")
BIRD_SMS_CHANNEL_ID = env.str("BIRD_SMS_CHANNEL_ID")
BIRD_VOICE_CHANNEL_ID = env.str("BIRD_VOICE_CHANNEL_ID")
UNITALK_VOICE_API_KEY = env.str("UNITALK_VOICE_API_KEY")

USER_PHONE_VOICE_TEST_TEXT = """<speak>Hi!<break time="300ms"></break> I'm your BuzzNodes assistant. This is a test call.</speak>"""

GOOGLE_RECAPTCHA_SECRET = env.str("GOOGLE_RECAPTCHA_SECRET")

CKEDITOR_5_CONFIGS = {
    "default": {
        "toolbar": [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "imageUpload",
        ],
    }
}

if not DEBUG:
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (
        "rest_framework.renderers.JSONRenderer",
    )
