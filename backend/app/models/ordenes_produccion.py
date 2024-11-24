from sqlalchemy import Column, Integer, String, Date, DateTime
from app.models import Base
from datetime import datetime

class OrdenProduccion(Base):
    __tablename__ = "ordenes_produccion"
    
    id = Column(Integer, primary_key=True, index=True)
    numero_orden = Column(String(50), unique=True, index=True)
    cantidad_total = Column(Integer, nullable=False)
    cantidad_producida = Column(Integer, default=0)
    estado = Column(String(20), default='PENDIENTE')
    cliente = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
