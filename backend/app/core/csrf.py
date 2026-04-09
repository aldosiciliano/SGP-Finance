import secrets

from fastapi import Response

from app.core.config import settings

try:
    from app.core.security import generate_csrf_token as _generate_csrf_token
except ImportError:
    _generate_csrf_token = None


def _build_csrf_token() -> str:
    if _generate_csrf_token is not None:
        return _generate_csrf_token()
    return secrets.token_urlsafe(32)


def set_csrf_cookie(response: Response) -> str:
    csrf_token = _build_csrf_token()
    response.set_cookie(
        key=getattr(settings, "csrf_cookie_name", "csrf_token"),
        value=csrf_token,
        max_age=settings.access_token_expire_minutes * 60,
        expires=settings.access_token_expire_minutes * 60,
        path="/",
        domain=None,
        secure=getattr(settings, "cookie_secure", False),
        httponly=False,
        samesite=getattr(settings, "cookie_samesite", "lax"),
    )
    return csrf_token


def clear_csrf_cookie(response: Response) -> None:
    response.delete_cookie(
        key=getattr(settings, "csrf_cookie_name", "csrf_token"),
        path="/",
        domain=None,
    )
