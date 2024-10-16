from django.urls import include, re_path

from users.views import CustomAuthTokenLogin, CustomAuthTokenLogout, userCheck


urlpatterns = [
    re_path(r'^auth/token/login/', CustomAuthTokenLogin.as_view()),
    re_path(r'^auth/token/logout/', CustomAuthTokenLogout.as_view()),
    re_path(r'^auth/check/', userCheck),
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
]
