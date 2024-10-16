from channels.generic.websocket import JsonWebsocketConsumer
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from djoser.conf import settings
from asgiref.sync import async_to_sync

from messenger.models import *
from messenger.serializers import MessageSerializer


class ChatConsumer(JsonWebsocketConsumer):
    def connect(self):
        try:
            token_obj = settings.TOKEN_MODEL.objects.get(key=self.scope["cookies"]["Token"])
        except KeyError:
            token_obj = None
        if token_obj:
            self.user = User.objects.get(pk=token_obj.user_id)
        self.dialog_id = self.scope["url_route"]["kwargs"]["dialog_id"]
        self.dialog = get_object_or_404(Dialog, id=self.dialog_id)
        async_to_sync(self.channel_layer.group_add)(
            self.dialog_id, self.channel_name
        )
        self.accept()

    def receive_json(self, content, **kwargs):
        message_content = content["body"].strip()
        if message_content:
            message = Message.objects.create(
                dialog=self.dialog,
                content=content["body"],
                author=self.user,
            )
            event = {
                'type': 'message_handler',
                'message_id': message.id,
            }
            async_to_sync(self.channel_layer.group_send)(
                self.dialog_id, event
            )

    def message_handler(self, event):
        message_id = event['message_id']
        message = Message.objects.get(pk=message_id)
        self.send_json(MessageSerializer(message).data)

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.dialog_id, self.channel_name
        )
