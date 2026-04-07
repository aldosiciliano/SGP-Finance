from datetime import datetime
from decimal import Decimal
from typing import Dict, Iterable, Tuple

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.categoria import Categoria
from app.models.gasto import Gasto
from app.models.presupuesto import Presupuesto
from app.models.usuario import Usuario
from app.schemas.reportes import (
    ReporteCategoriaItem,
    ReporteCategoriasResponse,
    ReporteComparativaCategoriaItem,
    ReporteComparativaPeriodo,
    ReporteComparativaResponse,
    ReporteMensualItem,
    ReporteMensualResponse,
)

router = APIRouter(prefix="/reportes", tags=["reportes"])

MONTH_NAMES = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
]


def _normalize_decimal(value: Decimal | int | float | None) -> Decimal:
    if value in (None, ""):
        return Decimal("0")
    return Decimal(str(value))


def _month_periods(count: int, anchor_month: int, anchor_year: int) -> list[tuple[int, int]]:
    periods = []

    for offset in range(count - 1, -1, -1):
        month_index = anchor_month - offset
        year = anchor_year

        while month_index <= 0:
            month_index += 12
            year -= 1

        periods.append((year, month_index))

    return periods


def _budget_totals_by_period(
    db: Session,
    usuario_id: int,
    periods: Iterable[Tuple[int, int]]
) -> Dict[Tuple[int, int], Decimal]:
    period_list = list(periods)
    period_set = set(period_list)
    rows = db.query(
        Presupuesto.anio,
        Presupuesto.mes,
        func.coalesce(func.sum(Presupuesto.monto), 0)
    ).filter(
        Presupuesto.usuario_id == usuario_id
    ).group_by(
        Presupuesto.anio,
        Presupuesto.mes
    ).all()

    return {
        (anio, mes): _normalize_decimal(total)
        for anio, mes, total in rows
        if (anio, mes) in period_set
    }


def _expense_totals_by_period(
    db: Session,
    usuario_id: int,
    periods: Iterable[Tuple[int, int]]
) -> Dict[Tuple[int, int], Decimal]:
    period_list = list(periods)
    period_set = set(period_list)
    rows = db.query(
        func.extract("year", Gasto.fecha).label("anio"),
        func.extract("month", Gasto.fecha).label("mes"),
        func.coalesce(func.sum(Gasto.monto_ars), 0)
    ).filter(
        Gasto.usuario_id == usuario_id
    ).group_by(
        func.extract("year", Gasto.fecha),
        func.extract("month", Gasto.fecha)
    ).all()

    return {
        (int(anio), int(mes)): _normalize_decimal(total)
        for anio, mes, total in rows
        if (int(anio), int(mes)) in period_set
    }


def _category_expenses_for_period(
    db: Session,
    usuario_id: int,
    mes: int,
    anio: int
) -> Dict[int | None, dict]:
    rows = db.query(
        Gasto.categoria_id,
        Categoria.nombre,
        func.coalesce(func.sum(Gasto.monto_ars), 0)
    ).outerjoin(
        Categoria, Categoria.id == Gasto.categoria_id
    ).filter(
        Gasto.usuario_id == usuario_id,
        func.extract("month", Gasto.fecha) == mes,
        func.extract("year", Gasto.fecha) == anio
    ).group_by(
        Gasto.categoria_id,
        Categoria.nombre
    ).all()

    return {
        categoria_id: {
            "categoria_id": categoria_id,
            "categoria_nombre": nombre or "Sin categoría",
            "total_gastado": _normalize_decimal(total),
        }
        for categoria_id, nombre, total in rows
    }


def _category_budgets_for_period(
    db: Session,
    usuario_id: int,
    mes: int,
    anio: int
) -> Dict[int, dict]:
    rows = db.query(
        Presupuesto.categoria_id,
        Categoria.nombre,
        func.coalesce(func.sum(Presupuesto.monto), 0)
    ).join(
        Categoria, Categoria.id == Presupuesto.categoria_id
    ).filter(
        Presupuesto.usuario_id == usuario_id,
        Presupuesto.mes == mes,
        Presupuesto.anio == anio
    ).group_by(
        Presupuesto.categoria_id,
        Categoria.nombre
    ).all()

    return {
        categoria_id: {
            "categoria_id": categoria_id,
            "categoria_nombre": nombre,
            "total_presupuestado": _normalize_decimal(total),
        }
        for categoria_id, nombre, total in rows
    }


def _build_comparative_categories(
    actual_data: Dict[int | None, dict],
    previous_data: Dict[int | None, dict]
) -> list[ReporteComparativaCategoriaItem]:
    category_ids = set(actual_data.keys()) | set(previous_data.keys())
    items = []

    for categoria_id in category_ids:
        current_item = actual_data.get(categoria_id, {})
        previous_item = previous_data.get(categoria_id, {})
        actual = _normalize_decimal(current_item.get("total_gastado"))
        anterior = _normalize_decimal(previous_item.get("total_gastado"))
        diferencia = actual - anterior
        variacion = None if anterior == 0 else round(float((diferencia / anterior) * 100), 1)

        items.append(
            ReporteComparativaCategoriaItem(
                categoria_id=categoria_id,
                categoria_nombre=current_item.get("categoria_nombre")
                or previous_item.get("categoria_nombre")
                or "Sin categoría",
                actual=actual,
                anterior=anterior,
                diferencia=diferencia,
                variacion_porcentual=variacion,
            )
        )

    return sorted(items, key=lambda item: abs(float(item.diferencia)), reverse=True)[:6]


@router.get("/mensual", response_model=ReporteMensualResponse)
def get_reporte_mensual(
    meses: int = Query(6, ge=2, le=12),
    mes: int | None = Query(None, ge=1, le=12),
    anio: int | None = Query(None, ge=2000, le=2100),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    today = datetime.now()
    anchor_month = mes or today.month
    anchor_year = anio or today.year
    periods = _month_periods(meses, anchor_month, anchor_year)
    expenses = _expense_totals_by_period(db, current_user.id, periods)
    budgets = _budget_totals_by_period(db, current_user.id, periods)

    report_items = []
    for anio, mes in periods:
        total_gastado = expenses.get((anio, mes), Decimal("0"))
        total_presupuestado = budgets.get((anio, mes), Decimal("0"))
        report_items.append(
            ReporteMensualItem(
                anio=anio,
                mes=mes,
                label=f"{MONTH_NAMES[mes - 1]} {str(anio)[-2:]}",
                total_gastado=total_gastado,
                total_presupuestado=total_presupuestado,
                diferencia=total_presupuestado - total_gastado,
            )
        )

    return {"periodos": report_items}


@router.get("/categorias", response_model=ReporteCategoriasResponse)
def get_reporte_categorias(
    mes: int = Query(..., ge=1, le=12),
    anio: int = Query(..., ge=2000, le=2100),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    expense_data = _category_expenses_for_period(db, current_user.id, mes, anio)
    budget_data = _category_budgets_for_period(db, current_user.id, mes, anio)
    total_gastado = sum(
        (item["total_gastado"] for item in expense_data.values()),
        Decimal("0")
    )

    category_ids = set(expense_data.keys()) | set(budget_data.keys())
    categorias = []

    for categoria_id in category_ids:
        expense_item = expense_data.get(categoria_id, {})
        budget_item = budget_data.get(categoria_id, {})
        total_categoria = _normalize_decimal(expense_item.get("total_gastado"))
        participacion = Decimal("0")

        if total_gastado > 0:
            participacion = (total_categoria / total_gastado) * Decimal("100")

        categorias.append(
            ReporteCategoriaItem(
                categoria_id=categoria_id,
                categoria_nombre=expense_item.get("categoria_nombre")
                or budget_item.get("categoria_nombre")
                or "Sin categoría",
                total_gastado=total_categoria,
                total_presupuestado=_normalize_decimal(budget_item.get("total_presupuestado")),
                participacion=participacion.quantize(Decimal("0.01")),
            )
        )

    categorias.sort(key=lambda item: float(item.total_gastado), reverse=True)

    return {
        "mes": mes,
        "anio": anio,
        "total_gastado": total_gastado,
        "categorias": categorias[:8],
    }


@router.get("/comparativa", response_model=ReporteComparativaResponse)
def get_reporte_comparativa(
    mes: int = Query(..., ge=1, le=12),
    anio: int = Query(..., ge=2000, le=2100),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    previous_month = 12 if mes == 1 else mes - 1
    previous_year = anio - 1 if mes == 1 else anio

    expense_totals = _expense_totals_by_period(
        db,
        current_user.id,
        [(anio, mes), (previous_year, previous_month)]
    )
    budget_totals = _budget_totals_by_period(
        db,
        current_user.id,
        [(anio, mes), (previous_year, previous_month)]
    )

    actual_gastado = expense_totals.get((anio, mes), Decimal("0"))
    anterior_gastado = expense_totals.get((previous_year, previous_month), Decimal("0"))
    actual_presupuestado = budget_totals.get((anio, mes), Decimal("0"))
    anterior_presupuestado = budget_totals.get((previous_year, previous_month), Decimal("0"))
    diferencia_gastado = actual_gastado - anterior_gastado
    diferencia_presupuestado = actual_presupuestado - anterior_presupuestado

    categorias_actuales = _category_expenses_for_period(db, current_user.id, mes, anio)
    categorias_anteriores = _category_expenses_for_period(db, current_user.id, previous_month, previous_year)

    return {
        "actual": ReporteComparativaPeriodo(
            mes=mes,
            anio=anio,
            total_gastado=actual_gastado,
            total_presupuestado=actual_presupuestado,
        ),
        "anterior": ReporteComparativaPeriodo(
            mes=previous_month,
            anio=previous_year,
            total_gastado=anterior_gastado,
            total_presupuestado=anterior_presupuestado,
        ),
        "diferencia_gastado": diferencia_gastado,
        "variacion_gastado_porcentual": None
        if anterior_gastado == 0
        else round(float((diferencia_gastado / anterior_gastado) * 100), 1),
        "diferencia_presupuestado": diferencia_presupuestado,
        "variacion_presupuestado_porcentual": None
        if anterior_presupuestado == 0
        else round(float((diferencia_presupuestado / anterior_presupuestado) * 100), 1),
        "categorias": _build_comparative_categories(categorias_actuales, categorias_anteriores),
    }
