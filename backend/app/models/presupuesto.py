from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Presupuesto(Base):
    __tablename__ = "presupuestos"
    
    id = Column(Integer, primary_key=True, index=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    monto = Column(Numeric(12, 2), nullable=False)
    mes = Column(Integer, nullable=False)  # 1-12
    anio = Column(Integer, nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    
    # Relaciones
    categoria = relationship("Categoria", backref="presupuestos")
    usuario = relationship("Usuario", backref="presupuestos")
    
    def __repr__(self):
        return f"<Presupuesto(monto={self.monto}, mes={self.mes}, anio={self.anio})>"
