from django.conf import settings

from rest_framework.permissions import BasePermission


class IsPrometheusUserAgent(BasePermission):
    def has_permission(self, request, view):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip in settings.METRICS_ALLOWED_IPS
