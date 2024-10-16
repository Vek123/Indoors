from rest_framework import serializers
from django.contrib.auth.models import User
from djoser.serializers import UserCreateSerializer
from djoser.conf import settings


class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        fields = tuple(User.REQUIRED_FIELDS) + (
            settings.LOGIN_FIELD,
            settings.USER_ID_FIELD,
            "first_name",
            "password",
        )


class RetrieveUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            settings.USER_ID_FIELD,
            "first_name",
        )
