import importlib.util
import sys
import types
import unittest
from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch


def _load_reportes_module():
    fastapi = types.ModuleType("fastapi")
    fastapi.APIRouter = lambda *args, **kwargs: SimpleNamespace(get=lambda *a, **k: (lambda fn: fn))
    fastapi.Depends = lambda dependency=None: dependency
    fastapi.Query = lambda default=None, **kwargs: default

    sqlalchemy = types.ModuleType("sqlalchemy")
    sqlalchemy.func = SimpleNamespace(extract=lambda *args, **kwargs: None, coalesce=lambda *args, **kwargs: None, sum=lambda *args, **kwargs: None)

    sqlalchemy_orm = types.ModuleType("sqlalchemy.orm")
    sqlalchemy_orm.Session = object

    auth_module = types.ModuleType("app.core.auth")
    auth_module.get_current_user = lambda: None

    database_module = types.ModuleType("app.core.database")
    database_module.get_db = lambda: None

    for module_name, class_name in [
        ("app.models.categoria", "Categoria"),
        ("app.models.gasto", "Gasto"),
        ("app.models.presupuesto", "Presupuesto"),
        ("app.models.usuario", "Usuario"),
    ]:
        module = types.ModuleType(module_name)
        setattr(module, class_name, type(class_name, (), {}))
        sys.modules[module_name] = module

    schemas_module = types.ModuleType("app.schemas.reportes")

    @dataclass
    class ReporteMensualItem:
        anio: int
        mes: int
        label: str
        total_gastado: Decimal
        total_presupuestado: Decimal
        diferencia: Decimal

    @dataclass
    class ReporteMensualResponse:
        periodos: list

    @dataclass
    class ReporteCategoriaItem:
        categoria_id: int | None
        categoria_nombre: str
        total_gastado: Decimal
        total_presupuestado: Decimal
        participacion: Decimal

    @dataclass
    class ReporteCategoriasResponse:
        mes: int
        anio: int
        total_gastado: Decimal
        categorias: list

    @dataclass
    class ReporteComparativaCategoriaItem:
        categoria_id: int | None
        categoria_nombre: str
        actual: Decimal
        anterior: Decimal
        diferencia: Decimal
        variacion_porcentual: float | None

    @dataclass
    class ReporteComparativaPeriodo:
        mes: int
        anio: int
        total_gastado: Decimal
        total_presupuestado: Decimal

    @dataclass
    class ReporteComparativaResponse:
        actual: ReporteComparativaPeriodo
        anterior: ReporteComparativaPeriodo
        diferencia_gastado: Decimal
        variacion_gastado_porcentual: float | None
        diferencia_presupuestado: Decimal
        variacion_presupuestado_porcentual: float | None
        categorias: list

    schemas_module.ReporteMensualItem = ReporteMensualItem
    schemas_module.ReporteMensualResponse = ReporteMensualResponse
    schemas_module.ReporteCategoriaItem = ReporteCategoriaItem
    schemas_module.ReporteCategoriasResponse = ReporteCategoriasResponse
    schemas_module.ReporteComparativaCategoriaItem = ReporteComparativaCategoriaItem
    schemas_module.ReporteComparativaPeriodo = ReporteComparativaPeriodo
    schemas_module.ReporteComparativaResponse = ReporteComparativaResponse

    sys.modules["fastapi"] = fastapi
    sys.modules["sqlalchemy"] = sqlalchemy
    sys.modules["sqlalchemy.orm"] = sqlalchemy_orm
    sys.modules["app.core.auth"] = auth_module
    sys.modules["app.core.database"] = database_module
    sys.modules["app.schemas.reportes"] = schemas_module

    module_path = Path(__file__).resolve().parents[1] / "app" / "routers" / "reportes.py"
    spec = importlib.util.spec_from_file_location("reportes_smoke_module", module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


reportes = _load_reportes_module()


class ReportesSmokeTest(unittest.TestCase):
    @patch.object(reportes, "_category_expenses_for_period")
    @patch.object(reportes, "_budget_totals_by_period")
    @patch.object(reportes, "_expense_totals_by_period")
    def test_get_reporte_comparativa_calculates_delta_and_variation(
        self,
        mock_expense_totals,
        mock_budget_totals,
        mock_category_expenses,
    ):
        user = SimpleNamespace(id=1)

        mock_expense_totals.return_value = {
            (2026, 3): Decimal("15000"),
            (2026, 2): Decimal("10000"),
        }
        mock_budget_totals.return_value = {
            (2026, 3): Decimal("12000"),
            (2026, 2): Decimal("9000"),
        }
        mock_category_expenses.side_effect = [
            {
                1: {"categoria_nombre": "Comida", "total_gastado": Decimal("9000")},
                2: {"categoria_nombre": "Transporte", "total_gastado": Decimal("6000")},
            },
            {
                1: {"categoria_nombre": "Comida", "total_gastado": Decimal("7000")},
                2: {"categoria_nombre": "Transporte", "total_gastado": Decimal("3000")},
            },
        ]

        response = reportes.get_reporte_comparativa(
            mes=3,
            anio=2026,
            db=object(),
            current_user=user,
        )

        self.assertEqual(response["diferencia_gastado"], Decimal("5000"))
        self.assertEqual(response["variacion_gastado_porcentual"], 50.0)
        self.assertEqual(response["actual"].total_presupuestado, Decimal("12000"))
        self.assertEqual(response["categorias"][0].categoria_nombre, "Transporte")

    @patch.object(reportes, "_category_budgets_for_period")
    @patch.object(reportes, "_category_expenses_for_period")
    def test_get_reporte_categorias_handles_empty_data(
        self,
        mock_category_expenses,
        mock_category_budgets,
    ):
        user = SimpleNamespace(id=1)

        mock_category_expenses.return_value = {}
        mock_category_budgets.return_value = {}

        response = reportes.get_reporte_categorias(
            mes=3,
            anio=2026,
            db=object(),
            current_user=user,
        )

        self.assertEqual(response["mes"], 3)
        self.assertEqual(response["anio"], 2026)
        self.assertEqual(response["total_gastado"], Decimal("0"))
        self.assertEqual(response["categorias"], [])

    @patch.object(reportes, "_category_budgets_for_period")
    @patch.object(reportes, "_category_expenses_for_period")
    def test_get_reporte_categorias_builds_totals_and_participation(
        self,
        mock_category_expenses,
        mock_category_budgets,
    ):
        user = SimpleNamespace(id=1)

        mock_category_expenses.return_value = {
            1: {"categoria_id": 1, "categoria_nombre": "Comida", "total_gastado": Decimal("9000")},
            2: {"categoria_id": 2, "categoria_nombre": "Transporte", "total_gastado": Decimal("6000")},
        }
        mock_category_budgets.return_value = {
            1: {"categoria_id": 1, "categoria_nombre": "Comida", "total_presupuestado": Decimal("10000")},
            2: {"categoria_id": 2, "categoria_nombre": "Transporte", "total_presupuestado": Decimal("8000")},
        }

        response = reportes.get_reporte_categorias(
            mes=3,
            anio=2026,
            db=object(),
            current_user=user,
        )

        self.assertEqual(response["total_gastado"], Decimal("15000"))
        self.assertEqual(len(response["categorias"]), 2)
        self.assertEqual(response["categorias"][0].categoria_nombre, "Comida")
        self.assertEqual(response["categorias"][0].participacion, Decimal("60.00"))
        self.assertEqual(response["categorias"][1].participacion, Decimal("40.00"))


if __name__ == "__main__":
    unittest.main()
