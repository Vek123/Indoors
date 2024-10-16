from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from messenger.serializers import *


class MessageApiViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.messages.all()


class DialogApiViewSet(viewsets.ModelViewSet):
    serializer_class = DialogSerializer
    permission_classes = [IsAuthenticated]
    # queryset = Dialog.objects.all()

    def get_queryset(self):
        return self.request.user.dialogs.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        created_obj = self.get_queryset().create()
        created_obj.members.add(*request.data["members"])
        created_obj_serializer = self.serializer_class(created_obj)
        headers = self.get_success_headers(serializer.data)
        return Response(
            created_obj_serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    @action(methods=["get"], detail=True)
    def messages(self, request, pk):
        dialog = Dialog.objects.get(pk=pk)
        messages = dialog.messages.all()
        messagesSerializer = MessageSerializer(
            messages,
            many=True,
            context={
                "request": request,
                "format": self.format_kwarg,
                "view": self,
            },
        )
        return Response(messagesSerializer.data)
