# Importar todos los modelos para que Alembic los detecte
from .usuario import Usuario
from .categoria import Categoria
from .gasto import Gasto
from .inversion import Inversion
from .tipo_cambio import TipoCambio
from .presupuesto import Presupuesto

__all__ = [
    "Usuario",
    "Categoria", 
    "Gasto",
    "Inversion",
    "TipoCambio",
    "Presupuesto"
]
