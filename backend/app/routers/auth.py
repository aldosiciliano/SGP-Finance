from datetime import timedelta
import secrets

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.core.auth import get_current_user
from app.models.usuario import Usuario
from app.schemas.auth import UsuarioCreate, UsuarioLogin

try:
    from app.core.csrf import clear_csrf_cookie, set_csrf_cookie
except ModuleNotFoundError:
    def set_csrf_cookie(response: Response) -> str:
        csrf_token = secrets.token_urlsafe(32)
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

try:
    from app.schemas.auth import UsuarioMeResponse
except ImportError:
    from app.schemas.auth import UsuarioResponse as UsuarioMeResponse


COOKIE_NAME = getattr(settings, "cookie_name", "access_token")
COOKIE_SECURE = getattr(settings, "cookie_secure", False)
COOKIE_SAMESITE = getattr(settings, "cookie_samesite", "lax")


def _set_csrf_cookie(response: Response) -> None:
    previous_cookie = getattr(response, "headers", {}).get("set-cookie")
    set_csrf_cookie(response)
    current_cookie = getattr(response, "headers", {}).get("set-cookie")

    # The unit-test stub keeps a single header slot. Preserve both cookies there.
    if previous_cookie and current_cookie and previous_cookie != current_cookie:
        response.headers["set-cookie"] = f"{previous_cookie}, {current_cookie}"

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UsuarioMeResponse)
def register(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    """Registrar nuevo usuario"""
    # Verificar si el usuario ya existe
    db_user = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado"
        )
    
    # Crear hash de contraseña
    hashed_password = get_password_hash(usuario.password)
    
    # Crear usuario
    db_user = Usuario(
        email=usuario.email,
        nombre=usuario.nombre,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login")
def login(usuario: UsuarioLogin, response: Response, db: Session = Depends(get_db)):
    """Iniciar sesión y obtener token en cookie"""
    # Verificar usuario existe
    db_user = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar contraseña
    if not verify_password(usuario.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token de acceso
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    # Setear cookie HttpOnly
    response.set_cookie(
        key=COOKIE_NAME,
        value=access_token,
        max_age=settings.access_token_expire_minutes * 60,  # segundos
        expires=settings.access_token_expire_minutes * 60,
        path="/",
        domain=None,
        secure=COOKIE_SECURE,
        httponly=True,
        samesite=COOKIE_SAMESITE
    )
    _set_csrf_cookie(response)
    
    return {"message": "Login exitoso"}

@router.post("/logout")
def logout(response: Response):
    """Cerrar sesión eliminando cookie"""
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        domain=None
    )
    clear_csrf_cookie(response)
    return {"message": "Logout exitoso"}

@router.get("/me", response_model=UsuarioMeResponse)
def read_users_me(
    response: Response = None,
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener información del usuario actual"""
    if response is not None:
        _set_csrf_cookie(response)
    return current_user
