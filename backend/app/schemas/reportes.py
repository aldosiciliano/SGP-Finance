from decimal import Decimal
from typing import List

from pydantic import BaseModel


class ReporteMensualItem(BaseModel):
    anio: int
    mes: int
    label: str
    total_gastado: Decimal
    total_presupuestado: Decimal
    diferencia: Decimal


class ReporteMensualResponse(BaseModel):
    periodos: List[ReporteMensualItem]


class ReporteCategoriaItem(BaseModel):
    categoria_id: int | None
    categoria_nombre: str
    total_gastado: Decimal
    total_presupuestado: Decimal
    participacion: Decimal


class ReporteCategoriasResponse(BaseModel):
    mes: int
    anio: int
    total_gastado: Decimal
    categorias: List[ReporteCategoriaItem]


class ReporteComparativaCategoriaItem(BaseModel):
    categoria_id: int | None
    categoria_nombre: str
    actual: Decimal
    anterior: Decimal
    diferencia: Decimal
    variacion_porcentual: float | None


class ReporteComparativaPeriodo(BaseModel):
    mes: int
    anio: int
    total_gastado: Decimal
    total_presupuestado: Decimal


class ReporteComparativaResponse(BaseModel):
    actual: ReporteComparativaPeriodo
    anterior: ReporteComparativaPeriodo
    diferencia_gastado: Decimal
    variacion_gastado_porcentual: float | None
    diferencia_presupuestado: Decimal
    variacion_presupuestado_porcentual: float | None
    categorias: List[ReporteComparativaCategoriaItem]
