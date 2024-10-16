from djoser.conf import settings


def auth_token(get_response):
    def middleware(request):
        requested_token = request.COOKIES.get('Token')
        token = None
        if requested_token:
            try:
                token = settings.TOKEN_MODEL.objects.get(key=request.COOKIES.get('Token'))
            except settings.TOKEN_MODEL.DoesNotExist:
                token = None
        if 'HTTP_AUTHORIZATION' not in request.META and request.path != "/auth/token/login/" and token:
            request.META['HTTP_AUTHORIZATION'] = f"Token {requested_token}"
        return get_response(request)

    return middleware
