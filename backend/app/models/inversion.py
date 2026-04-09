from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Inversion(Base):
    __tablename__ = "inversiones"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    tipo = Column(String, nullable=False)  # crypto | fondo | acciones | renta_fija
    monto_ars = Column(Numeric(12, 2), nullable=True)
    fecha_entrada = Column(DateTime(timezone=True), nullable=True)
    notas = Column(String, nullable=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    
    # Relación con usuario
    usuario = relationship("Usuario", backref="inversiones")
    
    def __repr__(self):
        return f"<Inversion(nombre='{self.nombre}', tipo='{self.tipo}')>"
