# Importar todos los routers
from .auth import router as auth_router
from .categorias import router as categorias_router
from .gastos import router as gastos_router
from .presupuestos import router as presupuestos_router

__all__ = ["auth_router", "categorias_router", "gastos_router", "presupuestos_router"]
