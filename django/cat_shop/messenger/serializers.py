from rest_framework import serializers

from messenger.models import *
from users.serializers import RetrieveUserSerializer


class DialogSerializer(serializers.ModelSerializer):
    members = RetrieveUserSerializer(many=True, read_only=True)

    class Meta:
        model = Dialog
        fields = (
            "id",
            "members",
            "updated_at",
        )


class MessageSerializer(serializers.ModelSerializer):
    author = RetrieveUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = (
            "id",
            "dialog",
            "author",
            "created_at",
            "content",
        )
