from rest_framework import routers

from messenger.views import MessageApiViewSet, DialogApiViewSet
from shop.views import CatApiViewSet
from users.views import UserModelViewSet


router = routers.DefaultRouter()
router.register(r'messages', MessageApiViewSet, basename="messages")
router.register(r'dialogs', DialogApiViewSet, basename="dialogs")
router.register(r'cats', CatApiViewSet, basename="cats")
router.register(r'users', UserModelViewSet, basename="users")

