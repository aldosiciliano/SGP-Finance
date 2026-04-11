from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.helpers import get_or_404
from app.models.usuario import Usuario
from app.models.categoria import Categoria
from app.schemas.categoria import CategoriaCreate, CategoriaResponse

router = APIRouter(prefix="/categorias", tags=["categorias"])

@router.post("/", response_model=CategoriaResponse)
def create_categoria(
    categoria: CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Crear nueva categoría para el usuario actual"""
    db_categoria = Categoria(**categoria.dict(), usuario_id=current_user.id)
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

@router.get("/", response_model=List[CategoriaResponse])
def get_categorias(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener todas las categorías del usuario actual"""
    categorias = db.query(Categoria).filter(Categoria.usuario_id == current_user.id).all()
    return categorias

@router.get("/{categoria_id}", response_model=CategoriaResponse)
def get_categoria(
    categoria_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener categoría específica del usuario"""
    return get_or_404(db, Categoria, categoria_id, current_user.id, "Categoría no encontrada")

@router.put("/{categoria_id}", response_model=CategoriaResponse)
def update_categoria(
    categoria_id: int,
    categoria_update: CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Actualizar categoría del usuario"""
    categoria = get_or_404(db, Categoria, categoria_id, current_user.id, "Categoría no encontrada")
    
    for field, value in categoria_update.dict().items():
        setattr(categoria, field, value)
    
    db.commit()
    db.refresh(categoria)
    return categoria

@router.delete("/{categoria_id}")
def delete_categoria(
    categoria_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Eliminar categoría del usuario"""
    categoria = get_or_404(db, Categoria, categoria_id, current_user.id, "Categoría no encontrada")
    
    db.delete(categoria)
    db.commit()
    return {"message": "Categoría eliminada correctamente"}
