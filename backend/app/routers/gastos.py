from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.helpers import get_or_404
from app.models.usuario import Usuario
from app.models.gasto import Gasto
from app.schemas.gasto import GastoCreate, GastoResponse, GastoUpdate

router = APIRouter(prefix="/gastos", tags=["gastos"])

@router.post("/", response_model=GastoResponse)
def create_gasto(
    gasto: GastoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Crear nuevo gasto para el usuario actual"""
    db_gasto = Gasto(**gasto.dict(), usuario_id=current_user.id)
    db.add(db_gasto)
    db.commit()
    db.refresh(db_gasto)
    return db_gasto

@router.get("/", response_model=List[GastoResponse])
def get_gastos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    categoria_id: Optional[int] = Query(None),
    fecha_desde: Optional[datetime] = Query(None),
    fecha_hasta: Optional[datetime] = Query(None)
):
    """Obtener gastos del usuario con filtros opcionales"""
    query = db.query(Gasto).filter(Gasto.usuario_id == current_user.id)
    
    if categoria_id:
        query = query.filter(Gasto.categoria_id == categoria_id)
    
    if fecha_desde:
        query = query.filter(Gasto.fecha >= fecha_desde)
    
    if fecha_hasta:
        query = query.filter(Gasto.fecha <= fecha_hasta)
    
    gastos = query.order_by(Gasto.fecha.desc()).offset(skip).limit(limit).all()
    return gastos

@router.get("/{gasto_id}", response_model=GastoResponse)
def get_gasto(
    gasto_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener gasto específico del usuario"""
    return get_or_404(db, Gasto, gasto_id, current_user.id, "Gasto no encontrado")

@router.put("/{gasto_id}", response_model=GastoResponse)
def update_gasto(
    gasto_id: int,
    gasto_update: GastoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Actualizar gasto del usuario"""
    gasto = get_or_404(db, Gasto, gasto_id, current_user.id, "Gasto no encontrado")
    
    for field, value in gasto_update.dict(exclude_unset=True).items():
        setattr(gasto, field, value)
    
    db.commit()
    db.refresh(gasto)
    return gasto

@router.delete("/{gasto_id}")
def delete_gasto(
    gasto_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Eliminar gasto del usuario"""
    gasto = get_or_404(db, Gasto, gasto_id, current_user.id, "Gasto no encontrado")
    
    db.delete(gasto)
    db.commit()
    return {"message": "Gasto eliminado correctamente"}
