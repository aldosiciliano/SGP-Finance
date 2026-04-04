from fastapi import Depends, HTTPException, status, Cookie
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_token
from app.models.usuario import Usuario

def get_current_user(
    access_token: str = Cookie(None),
    db: Session = Depends(get_db)
) -> Usuario:
    """Obtener usuario actual desde cookie HttpOnly"""
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = verify_token(access_token)
    
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user
