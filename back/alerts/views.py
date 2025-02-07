from rest_framework import views, permissions, response, status, exceptions
from django.utils.translation import gettext_lazy as _
from django.db import transaction

from alerts.models import (
    AlertSettingBase,
    AlertSettingVotingPower,
    AlertSettingUptime,
    AlertSettingComission,
    AlertSettingJailedStatus,
    AlertSettingTombstonedStatus,
    AlertSettingBondedStatus,
)
from alerts.serializers import (
    AlertSettingVotingPowerSerializer,
    AlertSettingUptimeSerializer,
    AlertSettingComissionSerializer,
    AlertSettingJailedStatusSerializer,
    AlertSettingTombstonedStatusSerializer,
    AlertSettingBondedStatusSerializer,
    UserAlertSettingVotingPowerSerializer,
    UserAlertSettingUptimeSerializer,
    UserAlertSettingComissionSerializer,
    UserAlertSettingJailedStatusSerializer,
    UserAlertSettingTombstonedStatusSerializer,
    UserAlertSettingBondedStatusSerializer,
    ManageUserAlertSettingSerializer,
)


class AlertSettingsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        voting_power_settings = AlertSettingVotingPower.objects.filter(status=True)
        voting_power_serializer = AlertSettingVotingPowerSerializer(
            voting_power_settings, many=True
        )

        uptime_settings = AlertSettingUptime.objects.filter(status=True)
        uptime_serializer = AlertSettingUptimeSerializer(uptime_settings, many=True)

        comission_settings = AlertSettingComission.objects.filter(status=True)
        comission_serializer = AlertSettingComissionSerializer(
            comission_settings, many=True
        )

        jailed_settings = AlertSettingJailedStatus.objects.filter(status=True)
        jailed_serializer = AlertSettingJailedStatusSerializer(
            jailed_settings, many=True
        )

        tombstoned_settings = AlertSettingTombstonedStatus.objects.filter(status=True)
        tombstoned_serializer = AlertSettingTombstonedStatusSerializer(
            tombstoned_settings, many=True
        )

        bonded_settings = AlertSettingBondedStatus.objects.filter(status=True)
        bonded_serializer = AlertSettingBondedStatusSerializer(
            bonded_settings, many=True
        )

        return response.Response(
            {
                AlertSettingBase.AlertType.VOTING_POWER: voting_power_serializer.data,
                AlertSettingBase.AlertType.UPTIME: uptime_serializer.data,
                AlertSettingBase.AlertType.COMISSION: comission_serializer.data,
                AlertSettingBase.AlertType.JAILED: jailed_serializer.data,
                AlertSettingBase.AlertType.TOMBSTONED: tombstoned_serializer.data,
                AlertSettingBase.AlertType.BONDED: bonded_serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class UserAlertSettingsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        voting_power_settings = request.user.user_alert_settings_voting_power.all()
        voting_power_serializer = UserAlertSettingVotingPowerSerializer(
            voting_power_settings, many=True
        )

        uptime_settings = request.user.user_alert_settings_uptime.all()
        uptime_serializer = UserAlertSettingUptimeSerializer(uptime_settings, many=True)

        comission_settings = request.user.user_alert_settings_comission.all()
        comission_serializer = UserAlertSettingComissionSerializer(
            comission_settings, many=True
        )

        jailed_settings = request.user.user_alert_settings_jailed_status.all()
        jailed_serializer = UserAlertSettingJailedStatusSerializer(
            jailed_settings, many=True
        )

        tombstoned_settings = request.user.user_alert_settings_tombstoned_status.all()
        tombstoned_serializer = UserAlertSettingTombstonedStatusSerializer(
            tombstoned_settings, many=True
        )

        bonded_settings = request.user.user_alert_settings_bonded_status.all()
        bonded_serializer = UserAlertSettingBondedStatusSerializer(
            bonded_settings, many=True
        )

        return response.Response(
            {
                AlertSettingBase.AlertType.VOTING_POWER: voting_power_serializer.data,
                AlertSettingBase.AlertType.UPTIME: uptime_serializer.data,
                AlertSettingBase.AlertType.COMISSION: comission_serializer.data,
                AlertSettingBase.AlertType.JAILED: jailed_serializer.data,
                AlertSettingBase.AlertType.TOMBSTONED: tombstoned_serializer.data,
                AlertSettingBase.AlertType.BONDED: bonded_serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class UserAlertManageSettingsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if type(request.data) != list or len(request.data) > 2:  # Max 2 setting allowed
            return response.Response(
                _("Unknown data format!", status=status.HTTP_400_BAD_REQUEST)
            )

        with transaction.atomic():
            for data in request.data:
                serializer = ManageUserAlertSettingSerializer(
                    data=data,
                    context={"request": request},
                )
                if not serializer.is_valid():
                    return response.Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )
                try:
                    serializer.create(validated_data=serializer.validated_data)
                except exceptions.ValidationError as err:
                    return response.Response(
                        err.detail, status=status.HTTP_400_BAD_REQUEST
                    )

        return response.Response("OK", status=status.HTTP_200_OK)

    def put(self, request):
        serializer = ManageUserAlertSettingSerializer(
            data=request.data, context={"request": request}, many=True
        )
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        for validated_data in serializer.validated_data:
            try:
                serializer.update_or_delete(validated_data=validated_data)
            except exceptions.ValidationError as err:
                return response.Response(err.detail, status=status.HTTP_400_BAD_REQUEST)

        return response.Response("OK", status=status.HTTP_200_OK)
