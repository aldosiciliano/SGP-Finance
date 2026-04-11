from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.core.helpers import get_or_404
from app.models.categoria import Categoria
from app.models.gasto import Gasto
from app.models.presupuesto import Presupuesto
from app.models.usuario import Usuario
from app.schemas.presupuesto import (
    PresupuestoCreate,
    PresupuestoResponse,
    PresupuestoResumenResponse,
    PresupuestoUpdate,
)

router = APIRouter(prefix="/presupuestos", tags=["presupuestos"])


def _validate_categoria_for_user(db: Session, categoria_id: int, usuario_id: int) -> Categoria:
    return get_or_404(db, Categoria, categoria_id, usuario_id, "Categoría no encontrada")


def _ensure_unique_presupuesto(
    db: Session,
    usuario_id: int,
    categoria_id: int,
    mes: int,
    anio: int,
    exclude_id: Optional[int] = None
) -> None:
    query = db.query(Presupuesto).filter(
        Presupuesto.usuario_id == usuario_id,
        Presupuesto.categoria_id == categoria_id,
        Presupuesto.mes == mes,
        Presupuesto.anio == anio,
    )

    if exclude_id is not None:
        query = query.filter(Presupuesto.id != exclude_id)

    exists = query.first()
    if exists:
        raise HTTPException(
            status_code=400,
            detail="Ya existe un presupuesto para esa categoría en el mes seleccionado"
        )


@router.post("/", response_model=PresupuestoResponse)
def create_presupuesto(
    presupuesto: PresupuestoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    _validate_categoria_for_user(db, presupuesto.categoria_id, current_user.id)
    _ensure_unique_presupuesto(
        db,
        current_user.id,
        presupuesto.categoria_id,
        presupuesto.mes,
        presupuesto.anio
    )

    db_presupuesto = Presupuesto(**presupuesto.dict(), usuario_id=current_user.id)
    db.add(db_presupuesto)
    db.commit()
    db.refresh(db_presupuesto)
    return db_presupuesto


@router.get("/", response_model=List[PresupuestoResponse])
def get_presupuestos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    mes: Optional[int] = Query(None, ge=1, le=12),
    anio: Optional[int] = Query(None, ge=2000, le=2100)
):
    query = db.query(Presupuesto).filter(Presupuesto.usuario_id == current_user.id)

    if mes is not None:
        query = query.filter(Presupuesto.mes == mes)

    if anio is not None:
        query = query.filter(Presupuesto.anio == anio)

    return query.order_by(Presupuesto.anio.desc(), Presupuesto.mes.desc(), Presupuesto.id.desc()).all()


@router.get("/resumen", response_model=PresupuestoResumenResponse)
def get_presupuesto_resumen(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    mes: Optional[int] = Query(None, ge=1, le=12),
    anio: Optional[int] = Query(None, ge=2000, le=2100)
):
    today = datetime.now()
    mes_resumen = mes or today.month
    anio_resumen = anio or today.year

    presupuestos = db.query(Presupuesto, Categoria).join(
        Categoria, Presupuesto.categoria_id == Categoria.id
    ).filter(
        Presupuesto.usuario_id == current_user.id,
        Presupuesto.mes == mes_resumen,
        Presupuesto.anio == anio_resumen
    ).order_by(Categoria.nombre.asc()).all()

    gastos_rows = db.query(
        Gasto.categoria_id,
        func.coalesce(func.sum(Gasto.monto_ars), 0)
    ).filter(
        Gasto.usuario_id == current_user.id,
        func.extract("month", Gasto.fecha) == mes_resumen,
        func.extract("year", Gasto.fecha) == anio_resumen
    ).group_by(Gasto.categoria_id).all()

    gastos_por_categoria = {
        categoria_id: Decimal(str(total))
        for categoria_id, total in gastos_rows
    }

    categorias = [
        {
            "categoria_id": presupuesto.categoria_id,
            "categoria_nombre": categoria.nombre,
            "monto": presupuesto.monto,
            "gastado": gastos_por_categoria.get(presupuesto.categoria_id, Decimal("0")),
            "restante": presupuesto.monto - gastos_por_categoria.get(presupuesto.categoria_id, Decimal("0")),
        }
        for presupuesto, categoria in presupuestos
    ]

    total_presupuestado = sum((presupuesto.monto for presupuesto, _ in presupuestos), Decimal("0"))
    total_gastado = sum((item["gastado"] for item in categorias), Decimal("0"))
    total_restante = total_presupuestado - total_gastado

    return {
        "mes": mes_resumen,
        "anio": anio_resumen,
        "total_presupuestado": total_presupuestado,
        "total_gastado": total_gastado,
        "total_restante": total_restante,
        "categorias": categorias,
    }


@router.put("/{presupuesto_id}", response_model=PresupuestoResponse)
def update_presupuesto(
    presupuesto_id: int,
    presupuesto_update: PresupuestoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    presupuesto = get_or_404(db, Presupuesto, presupuesto_id, current_user.id, "Presupuesto no encontrado")

    updated_categoria_id = presupuesto_update.categoria_id or presupuesto.categoria_id
    updated_mes = presupuesto_update.mes or presupuesto.mes
    updated_anio = presupuesto_update.anio or presupuesto.anio

    _validate_categoria_for_user(db, updated_categoria_id, current_user.id)
    _ensure_unique_presupuesto(
        db,
        current_user.id,
        updated_categoria_id,
        updated_mes,
        updated_anio,
        exclude_id=presupuesto.id
    )

    for field, value in presupuesto_update.dict(exclude_unset=True).items():
        setattr(presupuesto, field, value)

    db.commit()
    db.refresh(presupuesto)
    return presupuesto


@router.delete("/{presupuesto_id}")
def delete_presupuesto(
    presupuesto_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    presupuesto = get_or_404(db, Presupuesto, presupuesto_id, current_user.id, "Presupuesto no encontrado")

    db.delete(presupuesto)
    db.commit()
    return {"message": "Presupuesto eliminado correctamente"}
