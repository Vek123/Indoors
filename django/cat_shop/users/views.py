from djoser.views import TokenDestroyView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from users.serializers import *
from users.filters import *
from users.pagination import *


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userCheck(request):
    return Response(status=status.HTTP_204_NO_CONTENT)


class CustomAuthTokenLogin(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        set_cookie_str = f'Token={token}; Path=/; Secure; HttpOnly; SameSite=None; Partitioned;'
        response = Response({
            'id': user.pk,
            'first_name': user.first_name,
        })
        response.headers['Set-Cookie'] = set_cookie_str
        return response


class CustomAuthTokenLogout(TokenDestroyView):
    def post(self, request):
        response = super().post(request)
        delete_cookie_str = f'Token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; HttpOnly; SameSite=None; Partitioned;'
        response.headers['Set-Cookie'] = delete_cookie_str
        return response


class UserModelViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RetrieveUserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.filter(is_superuser=False).all()
    filterset_class = UserFilterSet
    pagination_class = UserModelPagination

