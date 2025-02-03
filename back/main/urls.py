from django.conf import settings
from django.urls import path, include
from django.contrib import admin
from django.conf.urls.i18n import i18n_patterns
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.utils.translation import gettext_lazy as _
from django.views.generic import TemplateView

from users import urls as users_urls
from blockchains import urls as blockchains_urls
from mails import urls as mails_urls


urlpatterns = [
    path("api/users/", include(users_urls)),
    path("api/blockchains/", include(blockchains_urls)),
    path("api/mails/", include(mails_urls)),
]

urlpatterns += i18n_patterns(
    path("", TemplateView.as_view(template_name="index.html"), name="home"),
    path("admin/", admin.site.urls),
    path("django-rq/", include("django_rq.urls")),
    path("rosetta/", include("rosetta.urls")),
    path("ckeditor5/", include("django_ckeditor_5.urls")),
    prefix_default_language=True,
)

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
