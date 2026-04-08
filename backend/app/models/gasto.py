from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Gasto(Base):
    __tablename__ = "gastos"
    
    id = Column(Integer, primary_key=True, index=True)
    monto_ars = Column(Numeric(12, 2), nullable=False)
    descripcion = Column(String, nullable=True)
    fecha = Column(DateTime(timezone=True), nullable=False)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    etiquetas = Column(ARRAY(String), nullable=True)
    
    # Relaciones
    categoria = relationship("Categoria", backref="gastos")
    usuario = relationship("Usuario", backref="gastos")
    
    def __repr__(self):
        return f"<Gasto(monto_ars={self.monto_ars}, fecha='{self.fecha}')>"
