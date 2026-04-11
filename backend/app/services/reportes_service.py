from decimal import Decimal
from typing import Dict, Iterable, Tuple
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.categoria import Categoria
from app.models.gasto import Gasto
from app.models.presupuesto import Presupuesto
from app.schemas.reportes import (
    ReporteComparativaCategoriaItem,
)

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


def normalize_decimal(value: Decimal | int | float | None) -> Decimal:
    if value in (None, ""):
        return Decimal("0")
    return Decimal(str(value))


def month_periods(count: int, anchor_month: int, anchor_year: int) -> list[tuple[int, int]]:
    periods = []

    for offset in range(count - 1, -1, -1):
        month_index = anchor_month - offset
        year = anchor_year

        while month_index <= 0:
            month_index += 12
            year -= 1

        periods.append((year, month_index))

    return periods


def budget_totals_by_period(
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
        (anio, mes): normalize_decimal(total)
        for anio, mes, total in rows
        if (anio, mes) in period_set
    }


def expense_totals_by_period(
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
        (int(anio), int(mes)): normalize_decimal(total)
        for anio, mes, total in rows
        if (int(anio), int(mes)) in period_set
    }


def category_expenses_for_period(
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
            "total_gastado": normalize_decimal(total),
        }
        for categoria_id, nombre, total in rows
    }


def category_budgets_for_period(
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
            "total_presupuestado": normalize_decimal(total),
        }
        for categoria_id, nombre, total in rows
    }


def build_comparative_categories(
    actual_data: Dict[int | None, dict],
    previous_data: Dict[int | None, dict]
) -> list[ReporteComparativaCategoriaItem]:
    category_ids = set(actual_data.keys()) | set(previous_data.keys())
    items = []

    for categoria_id in category_ids:
        current_item = actual_data.get(categoria_id, {})
        previous_item = previous_data.get(categoria_id, {})
        actual = normalize_decimal(current_item.get("total_gastado"))
        anterior = normalize_decimal(previous_item.get("total_gastado"))
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
