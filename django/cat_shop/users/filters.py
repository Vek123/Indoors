import django_filters

from django.contrib.auth.models import User


class UserFilterSet(django_filters.FilterSet):
    class Meta:
        model = User
        fields = {
            "first_name": ["icontains"],
        }
