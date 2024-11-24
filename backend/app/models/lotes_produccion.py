from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.models import Base

class LoteProduccion(Base):
    __tablename__ = "lotes_produccion"
    
    id = Column(Integer, primary_key=True, index=True)
    codigo_lote = Column(String(20), unique=True, nullable=False)
    orden_produccion_id = Column(Integer, ForeignKey('ordenes_produccion.id'))
    fecha = Column(Date, nullable=False)
    numero_secuencial = Column(Integer, nullable=False)
    letra_control = Column(String(1), nullable=False)
