import requests
import random

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now, timedelta
from django.contrib.auth import authenticate, login, logout

from rest_framework import views, response, status, permissions, utils

from main.throttles import OneSecRateThrottle
from users.models import User, UserPhone
from users.serializers import (
    LoginSerializer,
    RegisterSerializer,
    RegisterConfirmSerializer,
    LoginGoogleSerializer,
    RegisterGoogleSerializer,
    ResetPasswordSerializer,
    ResetPasswordConfirmSerializer,
    ChangePasswordSerializer,
    UserSerializer,
    UpdateUserSerializer,
    ChangeEmailSerializer,
    ChangeEmailConfirmSerializer,
    CreateUserPhoneSerializer,
    ConfirmUserPhoneSerializer,
)
from sms.models import SMSBase, SMSConfirm
from mails.tasks import (
    send_verification_mail,
    send_credentials_mail,
    send_reset_password_mail,
    send_changed_password,
    send_change_email_mail,
)

from sms.tasks import submit_sms_confirm_main_provider


class LoginView(views.APIView):
    permission_classes = (~permissions.IsAuthenticated,)
    throttle_classes = (OneSecRateThrottle,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )

        if not user:
            try:
                exist_user = User.objects.get(email=serializer.validated_data["email"])

                if not exist_user.is_active:
                    return response.Response(
                        {
                            "message": _(
                                "Your email is not confirmed. Please check your mailbox to complete the process."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except User.DoesNotExist:
                pass
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

        login(request, user)
        serializer = UserSerializer(user)
        return response.Response(serializer.data)


class RegisterView(views.APIView):
    permission_classes = (~permissions.IsAuthenticated,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.create(validated_data=serializer.validated_data)

        job = send_verification_mail.delay(
            email=user.email,
            password=serializer.validated_data["password"],
            token=user.token,
        )

        user_serializer = UserSerializer(user)
        return response.Response(user_serializer.data, status=status.HTTP_200_OK)


class RegisterConfirmView(views.APIView):
    permission_classes = (~permissions.IsAuthenticated,)
    throttle_classes = (OneSecRateThrottle,)

    def post(self, request):
        serializer = RegisterConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.validate_email(validated_data=serializer.validated_data)

        login(request, user)
        serializer = UserSerializer(user)
        return response.Response(serializer.data)


class LoginGoogleView(views.APIView):
    permission_classes = (~permissions.IsAuthenticated,)
    throttle_classes = (OneSecRateThrottle,)

    def post(self, request):
        serializer = LoginGoogleSerializer(data=request.data)

        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        resp_raw = requests.get(
            f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={serializer.validated_data['access_token']}"
        )

        resp = utils.json.loads(resp_raw.text)

        if not resp.get("email") or not resp.get("verified_email"):
            return response.Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = User.objects.get(email=resp["email"])

            if not user.is_active:
                user.is_active = True
                user.save()

            login(request, user)
            serializer = UserSerializer(user)
            return response.Response(serializer.data)

        except User.DoesNotExist:
            if not serializer.validated_data["is_register"]:
                return response.Response(status=status.HTTP_401_UNAUTHORIZED)

            serializer = RegisterGoogleSerializer(
                data=resp, context={"request": request}
            )

            if not serializer.is_valid():
                return response.Response(
                    serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

            user, password = serializer.create(validated_data=serializer.validated_data)

            job = send_credentials_mail.delay(
                email=user.email,
                password=password,
            )

            login(request, user)
            serializer = UserSerializer(user)
            return response.Response(serializer.data)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        logout(request)
        return response.Response("OK")


class ResetPasswordView(views.APIView):
    permission_classes = (~permissions.IsAuthenticated,)
    throttle_classes = (OneSecRateThrottle,)

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, email=serializer.validated_data["email"])

        job = send_reset_password_mail.delay(
            email=user.email,
            token=user.token,
        )

        return response.Response("OK")


class ResetPasswordConfirmView(views.APIView):
    permission_classes = (~permissions.IsAuthenticated,)

    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.reset_password(validated_data=serializer.validated_data)

        job = send_changed_password.delay(
            email=user.email,
            new_password=serializer.validated_data["new_password"],
        )

        return response.Response("OK")


class ProfileView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return response.Response(serializer.data)

    def put(self, request, *args, **kwargs):
        serializer = UpdateUserSerializer(request.user, data=request.data)
        if serializer.is_valid():
            user = serializer.update(
                instance=request.user, validated_data=serializer.validated_data
            )
            user_serializer = UserSerializer(user)
            return response.Response(user_serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        serializer = UpdateUserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.update(
                instance=request.user, validated_data=serializer.validated_data
            )
            user_serializer = UserSerializer(user)
            return response.Response(user_serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )

        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.change_password(serializer.validated_data)

        job = send_changed_password.delay(
            email=user.email,
            new_password=serializer.validated_data["new_password"],
        )

        return response.Response("OK")


class EmailChangeView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = ChangeEmailSerializer(data=request.data)

        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        job = send_change_email_mail.delay(request, request.user)

        return response.Response("OK")


class EmailChangeConfirmView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = ChangeEmailConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.change_email(validated_data=serializer.validated_data)

        return response.Response("OK")


class CreateUserPhoneView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    throttle_classes = (OneSecRateThrottle,)

    def post(self, request):
        serializer = CreateUserPhoneSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        user_phone = serializer.create(validated_data=serializer.validated_data)
        code = str(random.randint(10000, 99999))

        job = submit_sms_confirm_main_provider.delay(
            phone_number_id=user_phone.id,
            text=settings.PHONE_NUMBER_CODE_SMS_TEXT.format(code=code),
            code=code,
        )

        return response.Response("OK", status=status.HTTP_200_OK)


class ResendUserPhoneConfirm(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, user_phone_id):
        user_phone = get_object_or_404(
            UserPhone, pk=user_phone_id, user=request.user, status=False
        )

        queryset = SMSConfirm.objects.filter(phone=user_phone)
        confirm_sms_last = queryset.last()

        if confirm_sms_last:

            confirm_sms_count = queryset.count()
            if confirm_sms_count >= settings.MAX_RETRIES_CONFIRM_PHONE_SMS:
                return response.Response(
                    _("The SMS sending limit for this number has been reached"),
                    status=status.HTTP_400_BAD_REQUEST,
                )

            time_since_last = now() - confirm_sms_last.created
            if time_since_last < settings.RETRIES_CONFIRM_SMS_CODE_PERIOD:
                return response.Response(
                    _("Time limit for resending is 1 minute"),
                    status=status.HTTP_400_BAD_REQUEST,
                )

        code = str(random.randint(10000, 99999))

        job = submit_sms_confirm_main_provider.delay(
            phone_number_id=user_phone.id,
            text=settings.PHONE_NUMBER_CODE_SMS_TEXT.format(code=code),
            code=code,
        )

        return response.Response("OK", status=status.HTTP_200_OK)


class ConfirmUserPhoneView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    throttle_classes = (OneSecRateThrottle,)

    def post(self, request):
        serializer = ConfirmUserPhoneSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        sms_confirm = get_object_or_404(
            SMSConfirm, code=serializer.validated_data["code"], is_used=False
        )
        sms_confirm.is_used = True
        sms_confirm.phone.status = True
        sms_confirm.save()
        sms_confirm.phone.save()

        return response.Response("OK", status=status.HTTP_200_OK)
