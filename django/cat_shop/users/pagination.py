from rest_framework.pagination import LimitOffsetPagination


class UserModelPagination(LimitOffsetPagination):
    default_limit = 20
