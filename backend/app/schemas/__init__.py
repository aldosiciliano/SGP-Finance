# Importar todos los schemas
from .auth import (
    UsuarioBase,
    UsuarioCreate,
    UsuarioResponse,
    Token,
    TokenData,
    UsuarioLogin
)
from .categoria import (
    CategoriaBase,
    CategoriaCreate,
    CategoriaResponse
)
from .gasto import (
    GastoBase,
    GastoCreate,
    GastoResponse,
    GastoUpdate
)
from .presupuesto import (
    PresupuestoBase,
    PresupuestoCreate,
    PresupuestoUpdate,
    PresupuestoResponse,
    PresupuestoCategoriaResumen,
    PresupuestoResumenResponse
)
from .reportes import (
    ReporteMensualItem,
    ReporteMensualResponse,
    ReporteCategoriaItem,
    ReporteCategoriasResponse,
    ReporteComparativaCategoriaItem,
    ReporteComparativaPeriodo,
    ReporteComparativaResponse,
)

__all__ = [
    "UsuarioBase",
    "UsuarioCreate", 
    "UsuarioResponse",
    "Token",
    "TokenData",
    "UsuarioLogin",
    "CategoriaBase",
    "CategoriaCreate",
    "CategoriaResponse",
    "GastoBase",
    "GastoCreate",
    "GastoResponse",
    "GastoUpdate",
    "PresupuestoBase",
    "PresupuestoCreate",
    "PresupuestoUpdate",
    "PresupuestoResponse",
    "PresupuestoCategoriaResumen",
    "PresupuestoResumenResponse",
    "ReporteMensualItem",
    "ReporteMensualResponse",
    "ReporteCategoriaItem",
    "ReporteCategoriasResponse",
    "ReporteComparativaCategoriaItem",
    "ReporteComparativaPeriodo",
    "ReporteComparativaResponse",
]
