from itertools import chain
from rest_framework import views, permissions, response, status, exceptions
from django.utils.translation import gettext_lazy as _
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404

from alerts.models import (
    AlertSettingBase,
    AlertSettingVotingPower,
    AlertSettingUptime,
    AlertSettingComission,
    AlertSettingJailedStatus,
    AlertSettingTombstonedStatus,
    AlertSettingBondedStatus,
    AlertSettingOtelUpdate,
    AlertSettingSyncStatus,
)
from alerts.serializers import (
    AlertSettingVotingPowerSerializer,
    AlertSettingUptimeSerializer,
    AlertSettingComissionSerializer,
    AlertSettingJailedStatusSerializer,
    AlertSettingTombstonedStatusSerializer,
    AlertSettingBondedStatusSerializer,
    AlertSettingOtelUpdateSerializer,
    AlertSettingSyncStatusSerializer,
    UserAlertSettingVotingPowerSerializer,
    UserAlertSettingUptimeSerializer,
    UserAlertSettingComissionSerializer,
    UserAlertSettingJailedStatusSerializer,
    UserAlertSettingTombstonedStatusSerializer,
    UserAlertSettingBondedStatusSerializer,
    UserAlertSettingOtelUpdateSerializer,
    UserAlertSettingSyncStatusSerializer,
    ManageUserAlertSettingSerializer,
    AlertBaseSerializer,
)
from blockchains.models import Blockchain
from sms.models import (
    SMSAlertVotingPower,
    SMSAlertUptime,
    SMSAlertComission,
    SMSAlertJailedStatus,
    SMSAlertTombstonedStatus,
    SMSAlertBondedStatus,
    SMSAlertOtelUpdate,
    SMSAlertSyncStatus,
)
from voice.models import (
    VoiceAlertVotingPower,
    VoiceAlertUptime,
    VoiceAlertComission,
    VoiceAlertJailedStatus,
    VoiceAlertTombstonedStatus,
    VoiceAlertBondedStatus,
    VoiceAlertOtelUpdate,
    VoiceAlertSyncStatus,
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

        otel_settings = AlertSettingOtelUpdate.objects.filter(status=True)
        otel_serializer = AlertSettingOtelUpdateSerializer(otel_settings, many=True)

        sync_settings = AlertSettingSyncStatus.objects.filter(status=True)
        sync_serializer = AlertSettingSyncStatusSerializer(sync_settings, many=True)

        return response.Response(
            {
                AlertSettingBase.AlertType.VOTING_POWER: voting_power_serializer.data,
                AlertSettingBase.AlertType.UPTIME: uptime_serializer.data,
                AlertSettingBase.AlertType.COMISSION: comission_serializer.data,
                AlertSettingBase.AlertType.JAILED: jailed_serializer.data,
                AlertSettingBase.AlertType.TOMBSTONED: tombstoned_serializer.data,
                AlertSettingBase.AlertType.BONDED: bonded_serializer.data,
                AlertSettingBase.AlertType.OTEL_UPDATE: otel_serializer.data,
                AlertSettingBase.AlertType.SYNC_STATUS: sync_serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class UserAlertSettingsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, blockchain_id):
        blockchain = get_object_or_404(
            Blockchain, pk=blockchain_id, btype=Blockchain.Type.COSMOS, status=True
        )

        voting_power_settings = request.user.user_alert_settings_voting_power.filter(
            blockchain_validator__blockchain_id=blockchain.id
        )
        voting_power_serializer = UserAlertSettingVotingPowerSerializer(
            voting_power_settings, many=True
        )

        uptime_settings = request.user.user_alert_settings_uptime.filter(
            blockchain_validator__blockchain_id=blockchain.id
        )
        uptime_serializer = UserAlertSettingUptimeSerializer(uptime_settings, many=True)

        comission_settings = request.user.user_alert_settings_comission.filter(
            blockchain_validator__blockchain_id=blockchain.id
        )
        comission_serializer = UserAlertSettingComissionSerializer(
            comission_settings, many=True
        )

        jailed_settings = request.user.user_alert_settings_jailed_status.filter(
            blockchain_validator__blockchain_id=blockchain.id
        )
        jailed_serializer = UserAlertSettingJailedStatusSerializer(
            jailed_settings, many=True
        )

        tombstoned_settings = request.user.user_alert_settings_tombstoned_status.filter(
            blockchain_validator__blockchain_id=blockchain.id
        )
        tombstoned_serializer = UserAlertSettingTombstonedStatusSerializer(
            tombstoned_settings, many=True
        )

        bonded_settings = request.user.user_alert_settings_bonded_status.filter(
            blockchain_validator__blockchain_id=blockchain.id
        )
        bonded_serializer = UserAlertSettingBondedStatusSerializer(
            bonded_settings, many=True
        )

        otel_settings = request.user.user_alert_settings_otel_update.filter(
            blockchain_validator__blockchain_id=blockchain.id
        )
        otel_serializer = UserAlertSettingOtelUpdateSerializer(otel_settings, many=True)

        sync_settings = request.user.user_alert_settings_sync_status.filter(
            blockchain_validator__blockchain_id=blockchain.id
        )
        sync_serializer = UserAlertSettingSyncStatusSerializer(sync_settings, many=True)

        return response.Response(
            {
                AlertSettingBase.AlertType.VOTING_POWER: voting_power_serializer.data,
                AlertSettingBase.AlertType.UPTIME: uptime_serializer.data,
                AlertSettingBase.AlertType.COMISSION: comission_serializer.data,
                AlertSettingBase.AlertType.JAILED: jailed_serializer.data,
                AlertSettingBase.AlertType.TOMBSTONED: tombstoned_serializer.data,
                AlertSettingBase.AlertType.BONDED: bonded_serializer.data,
                AlertSettingBase.AlertType.OTEL_UPDATE: otel_serializer.data,
                AlertSettingBase.AlertType.SYNC_STATUS: sync_serializer.data,
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

        managed_user_settings = []
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
                    user_setting = serializer.manage(
                        validated_data=serializer.validated_data
                    )
                    managed_user_settings.append(user_setting)
                except exceptions.ValidationError as err:
                    return response.Response(
                        err.detail, status=status.HTTP_400_BAD_REQUEST
                    )

        return response.Response("OK", status=status.HTTP_200_OK)


class UserAlertsHistoryView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, blockchain_id):
        blockchain = get_object_or_404(
            Blockchain, pk=blockchain_id, btype=Blockchain.Type.COSMOS, status=True
        )

        models = [
            SMSAlertVotingPower,
            SMSAlertUptime,
            SMSAlertComission,
            SMSAlertJailedStatus,
            SMSAlertTombstonedStatus,
            SMSAlertBondedStatus,
            SMSAlertOtelUpdate,
            SMSAlertSyncStatus,
            VoiceAlertVotingPower,
            VoiceAlertUptime,
            VoiceAlertComission,
            VoiceAlertJailedStatus,
            VoiceAlertTombstonedStatus,
            VoiceAlertBondedStatus,
            VoiceAlertOtelUpdate,
            VoiceAlertSyncStatus,
        ]

        queryset_list = list(
            chain(
                *[
                    model.objects.filter(user=request.user).filter(
                        Q(validator__blockchain=blockchain)
                        | Q(bridge__blockchain=blockchain)
                    )
                    for model in models
                ]
            )
        )
        sorted_data = sorted(queryset_list, key=lambda x: x.created, reverse=True)
        serializer = AlertBaseSerializer(sorted_data, many=True)

        return response.Response(serializer.data)
