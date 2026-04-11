from datetime import datetime
from decimal import Decimal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.usuario import Usuario
from app.schemas.reportes import (
    ReporteCategoriaItem,
    ReporteCategoriasResponse,
    ReporteComparativaPeriodo,
    ReporteComparativaResponse,
    ReporteMensualItem,
    ReporteMensualResponse,
)
from app.services.reportes_service import (
    MONTH_NAMES,
    budget_totals_by_period,
    build_comparative_categories,
    category_budgets_for_period,
    category_expenses_for_period,
    expense_totals_by_period,
    month_periods,
    normalize_decimal,
)

router = APIRouter(prefix="/reportes", tags=["reportes"])


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
    periods = month_periods(meses, anchor_month, anchor_year)
    expenses = expense_totals_by_period(db, current_user.id, periods)
    budgets = budget_totals_by_period(db, current_user.id, periods)

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
    expense_data = category_expenses_for_period(db, current_user.id, mes, anio)
    budget_data = category_budgets_for_period(db, current_user.id, mes, anio)
    total_gastado = sum(
        (item["total_gastado"] for item in expense_data.values()),
        Decimal("0")
    )

    category_ids = set(expense_data.keys()) | set(budget_data.keys())
    categorias = []

    for categoria_id in category_ids:
        expense_item = expense_data.get(categoria_id, {})
        budget_item = budget_data.get(categoria_id, {})
        total_categoria = normalize_decimal(expense_item.get("total_gastado"))
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
                total_presupuestado=normalize_decimal(budget_item.get("total_presupuestado")),
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

    expense_totals = expense_totals_by_period(
        db,
        current_user.id,
        [(anio, mes), (previous_year, previous_month)]
    )
    budget_totals = budget_totals_by_period(
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

    categorias_actuales = category_expenses_for_period(db, current_user.id, mes, anio)
    categorias_anteriores = category_expenses_for_period(db, current_user.id, previous_month, previous_year)

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
        "categorias": build_comparative_categories(categorias_actuales, categorias_anteriores),
    }
