from rest_framework import serializers

from shop.models import *


class CatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cat
        fields = (
            "id",
            "name",
            "breed",
            "age",
            "skin",
            "breeder",
        )
