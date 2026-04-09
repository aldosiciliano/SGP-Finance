from pydantic import BaseModel
from typing import Optional

class CategoriaBase(BaseModel):
    nombre: str
    icono: Optional[str] = None
    color: Optional[str] = None

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaResponse(CategoriaBase):
    id: int
    
    class Config:
        from_attributes = True
