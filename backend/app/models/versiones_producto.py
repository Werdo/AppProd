from sqlalchemy import Column, Integer, String, Boolean
from app.models import Base

class VersionProducto(Base):
    __tablename__ = "versiones_producto"
    
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(4), nullable=False)
    descripcion = Column(String(100))
    es_oem = Column(Boolean, default=False)
    activo = Column(Boolean, default=True)
