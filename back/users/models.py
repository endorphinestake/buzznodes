from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    class RegisterType(models.TextChoices):
        BASIC = "basic", "Basic"

    username = None
    email = models.EmailField(unique=True)
    locale = models.CharField(
        max_length=2, choices=settings.LANGUAGES, default=settings.LANGUAGE_CODE
    )
    register_type = models.CharField(
        max_length=10,
        choices=RegisterType.choices,
        default=RegisterType.BASIC,
        verbose_name=_("Register type"),
    )
    first_name = models.CharField(
        max_length=100, null=True, blank=True, verbose_name=_("First Name")
    )
    last_name = models.CharField(
        max_length=100, null=True, blank=True, verbose_name=_("Last Name")
    )
    token = models.CharField(
        db_index=True, max_length=100, null=True, blank=True, verbose_name=_("Token")
    )
    tmp_email = models.EmailField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ()

    objects = UserManager()

    def __str__(self):
        return self.email


class UserPhone(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_phones",
        verbose_name=_("User"),
    )
    phone = models.CharField(max_length=15, verbose_name=_("Phone Number"))
    status = models.BooleanField(default=False, verbose_name=_("Confirmed"))
    updated = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return f"{self.phone}"

    class Meta:
        verbose_name = _("User Phone")
        verbose_name_plural = _("User Phones")
