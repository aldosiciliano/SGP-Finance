from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Categoria(Base):
    __tablename__ = "categorias"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    icono = Column(String, nullable=True)
    color = Column(String, nullable=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    
    # Relación con usuario
    usuario = relationship("Usuario", backref="categorias")
    
    def __repr__(self):
        return f"<Categoria(nombre='{self.nombre}', usuario_id={self.usuario_id})>"
