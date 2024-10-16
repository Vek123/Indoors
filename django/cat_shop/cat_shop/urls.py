from django.contrib import admin
from django.urls import path, include

from cat_shop.routers import router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    path('api/v1/', include('users.urls'))
]
