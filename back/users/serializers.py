import phonenumbers

from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import Group
from django.contrib.auth.tokens import default_token_generator
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now

from rest_framework import serializers, validators

from users.models import User, UserPhone
from sms.models import SMSConfirm


class BaseTokenSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)

    def validate_token(self, value):
        try:
            user = User.objects.get(token=value.strip())

            if not default_token_generator.check_token(user, token=value):
                raise serializers.ValidationError(
                    _("The confirmation code is expired!")
                )

        except User.DoesNotExist:
            raise serializers.ValidationError(_("The confirmation code is incorrect!"))
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[
            validators.UniqueValidator(
                queryset=User.objects.all(),
                message=_("The email address is already registered!"),
            )
        ],
    )
    password = serializers.CharField(required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = (
            "email",
            "password",
        )

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data["email"],
            locale=self.context["request"].LANGUAGE_CODE.split("-")[0].lower(),
            register_type=User.RegisterType.BASIC,
            is_active=False,
        )

        user.set_password(validated_data["password"])
        user.token = default_token_generator.make_token(user)
        user.save()

        return user


class RegisterConfirmSerializer(BaseTokenSerializer):
    def validate_email(self, validated_data):
        user = User.objects.get(token=validated_data["token"])
        user.is_active = True
        user.save()
        return user


class LoginGoogleSerializer(serializers.Serializer):
    access_token = serializers.CharField(required=True)
    password = serializers.CharField(
        required=False, allow_blank=True, validators=[validate_password]
    )
    is_register = serializers.BooleanField(required=True)


class RegisterGoogleSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[
            validators.UniqueValidator(
                queryset=User.objects.all(),
                message=_("The email address is already registered!"),
            )
        ],
    )
    name = serializers.CharField(required=False, allow_blank=True)
    given_name = serializers.CharField(required=False, allow_blank=True)
    picture = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            "email",
            "name",
            "given_name",
            "picture",
        )

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data["email"],
            locale=self.context["request"].LANGUAGE_CODE.split("-")[0].lower(),
            register_type=User.RegisterType.GOOGLE,
            first_name=validated_data.get("name", ""),
            is_active=True,
        )

        password = BaseUserManager().make_random_password()
        user.set_password(password)
        user.save()

        return user, password


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)

            user.token = default_token_generator.make_token(user)
            user.save()

        except User.DoesNotExist:
            raise serializers.ValidationError(
                _("No user found with this email address")
            )
        return value


class ResetPasswordConfirmSerializer(BaseTokenSerializer):
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate_confirm_new_password(self, value):
        new_password = self.initial_data.get("new_password")

        if new_password != value:
            raise serializers.ValidationError(_("The passwords do not match"))
        return value

    def reset_password(self, validated_data):
        user = User.objects.get(token=validated_data["token"])
        user.set_password(validated_data["new_password"])
        user.is_active = True
        user.save()
        return user


class ChangeEmailSerializer(serializers.Serializer):
    new_email = serializers.EmailField(required=True)

    def validate_new_email(self, value):
        try:
            user = User.objects.get(email=value.strip())
            raise serializers.ValidationError(_("This email is already registered!"))
        except User.DoesNotExist:
            pass
        return value


class ChangeEmailConfirmSerializer(BaseTokenSerializer):
    def validate_token(self, value):
        value = super().validate_token(value)
        return value

    def change_email(self, validated_data):
        user = User.objects.get(token=validated_data["token"])
        user.email = user.tmp_email
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)
    current_password = serializers.CharField(required=True)

    def validate_confirm_new_password(self, value):
        new_password = self.initial_data.get("new_password")

        if new_password != value:
            raise serializers.ValidationError(_("The passwords do not match"))
        return value

    def validate_current_password(self, value):
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError(
                _("Password is incorrect. Please check and try again")
            )
        return value

    def change_password(self, validated_data):
        user = self.context["request"].user
        user.set_password(validated_data["new_password"])
        user.save()
        return user


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = (
            "id",
            "name",
        )


class UserPhoneSerializer(serializers.ModelSerializer):
    last_sent_confirm = serializers.SerializerMethodField()

    def get_last_sent_confirm(self, obj):
        if not obj.status:
            last_sms = SMSConfirm.objects.filter(phone=obj).last()
            return last_sms.created if last_sms else None
        return None

    class Meta:
        model = UserPhone
        fields = (
            "id",
            "phone",
            "status",
            "updated",
            "last_sent_confirm",
        )


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    phones = UserPhoneSerializer(many=True, read_only=True, source="user_phones")

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "locale",
            "first_name",
            "last_name",
            "groups",
            "phones",
        )


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
        )

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)

        instance.save()
        return instance


class CreateUserPhoneSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)

    def validate_phone(self, value):
        try:
            parsed_number = phonenumbers.parse(value, None)
            if not phonenumbers.is_valid_number(parsed_number):
                raise serializers.ValidationError(
                    _(
                        "Invalid phone number. Please enter a valid number in international format, e.g., +1234567890."
                    )
                )
        except phonenumbers.NumberParseException:
            raise serializers.ValidationError(
                _(
                    "Please enter a valid number in international format, e.g., +1234567890."
                )
            )

        new_phone = phonenumbers.format_number(
            parsed_number, phonenumbers.PhoneNumberFormat.E164
        )

        if self.context["request"].user.user_phones.filter(phone=new_phone).exists():
            raise serializers.ValidationError(
                _("This phone number is already registered")
            )

        return new_phone

    def create(self, validated_data: dict) -> UserPhone:
        user_phone = UserPhone.objects.create(
            user=self.context["request"].user,
            phone=validated_data["phone"],
            status=False,
        )
        return user_phone


class ConfirmUserPhoneSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)

    def validate_code(self, value):
        if not SMSConfirm.objects.filter(
            code=value, expire_code__gt=now(), is_used=False
        ).exists():
            raise serializers.ValidationError(
                _("The verification code is invalid or expired")
            )
        return value
