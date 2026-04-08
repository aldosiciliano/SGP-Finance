from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

class GastoBase(BaseModel):
    monto_ars: Decimal
    descripcion: Optional[str] = None
    fecha: datetime
    categoria_id: int
    etiquetas: Optional[List[str]] = None

class GastoCreate(GastoBase):
    pass

class GastoResponse(GastoBase):
    id: int
    usuario_id: int
    
    class Config:
        from_attributes = True

class GastoUpdate(BaseModel):
    monto_ars: Optional[Decimal] = None
    descripcion: Optional[str] = None
    fecha: Optional[datetime] = None
    categoria_id: Optional[int] = None
    etiquetas: Optional[List[str]] = None
