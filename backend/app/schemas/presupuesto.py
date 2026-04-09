from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class PresupuestoBase(BaseModel):
    categoria_id: int
    monto: Decimal = Field(..., gt=0)
    mes: int = Field(..., ge=1, le=12)
    anio: int = Field(..., ge=2000, le=2100)


class PresupuestoCreate(PresupuestoBase):
    pass


class PresupuestoUpdate(BaseModel):
    categoria_id: Optional[int] = None
    monto: Optional[Decimal] = Field(default=None, gt=0)
    mes: Optional[int] = Field(default=None, ge=1, le=12)
    anio: Optional[int] = Field(default=None, ge=2000, le=2100)


class PresupuestoResponse(PresupuestoBase):
    id: int

    class Config:
        from_attributes = True


class PresupuestoCategoriaResumen(BaseModel):
    categoria_id: int
    categoria_nombre: str
    monto: Decimal
    gastado: Decimal
    restante: Decimal


class PresupuestoResumenResponse(BaseModel):
    mes: int
    anio: int
    total_presupuestado: Decimal
    total_gastado: Decimal
    total_restante: Decimal
    categorias: List[PresupuestoCategoriaResumen]
