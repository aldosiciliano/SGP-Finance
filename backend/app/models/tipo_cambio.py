from sqlalchemy import Column, Integer, String, Date, Numeric
from app.core.database import Base

class TipoCambio(Base):
    __tablename__ = "tipos_cambio"
    
    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, nullable=False, unique=True)
    usd_ars = Column(Numeric(10, 4), nullable=False)
    fuente = Column(String, nullable=False)  # "bluelytics", "manual"
    
    def __repr__(self):
        return f"<TipoCambio(fecha='{self.fecha}', usd_ars={self.usd_ars})>"
