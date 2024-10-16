from channels.routing import URLRouter
from django.urls import re_path

from messenger.consumers import *


router = URLRouter([
    re_path(r"^ws/chat/(?P<dialog_id>[0-9]+)/$", ChatConsumer.as_asgi()),
])
