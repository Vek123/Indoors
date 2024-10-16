from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from shop.serializers import *


class CatApiViewSet(viewsets.ModelViewSet):
    serializer_class = CatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.cats.all()
