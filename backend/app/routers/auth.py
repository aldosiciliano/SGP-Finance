from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.core.auth import get_current_user
from app.models.usuario import Usuario
from app.schemas.auth import UsuarioCreate, UsuarioResponse, UsuarioLogin

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UsuarioResponse)
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
        key="access_token",
        value=access_token,
        max_age=settings.access_token_expire_minutes * 60,  # segundos
        expires=settings.access_token_expire_minutes * 60,
        path="/",
        domain=None,
        secure=False,  # En producción True (HTTPS)
        httponly=True,
        samesite="lax"
    )
    
    return {"message": "Login exitoso"}

@router.post("/logout")
def logout(response: Response):
    """Cerrar sesión eliminando cookie"""
    response.delete_cookie(
        key="access_token",
        path="/",
        domain=None
    )
    return {"message": "Logout exitoso"}

@router.get("/me", response_model=UsuarioResponse)
def read_users_me(current_user: Usuario = Depends(get_current_user)):
    """Obtener información del usuario actual"""
    return current_user
