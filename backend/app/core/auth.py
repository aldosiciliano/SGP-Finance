from typing import Optional

from fastapi import Depends, HTTPException, status, Cookie
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_token
from app.models.usuario import Usuario


COOKIE_NAME = getattr(settings, "cookie_name", "access_token")


def _cookie_optional(default=None):
    try:
        return Cookie(default=default, alias=COOKIE_NAME)
    except TypeError:
        return Cookie(default=default)


def _raise_unauthorized(detail: str) -> None:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    access_token: Optional[str] = _cookie_optional(default=None),
    db: Session = Depends(get_db)
) -> Usuario:
    """Obtener usuario actual desde cookie HttpOnly"""
    if access_token is None:
        _raise_unauthorized("No autenticado")

    email = verify_token(access_token)

    if email is None:
        _raise_unauthorized("Token inválido")

    user = db.query(Usuario).filter(Usuario.email == email).first()
    if user is None:
        _raise_unauthorized("Usuario no encontrado")

    return user
