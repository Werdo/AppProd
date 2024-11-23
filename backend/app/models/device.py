from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Device(Base):
    __tablename__ = "dispositivos"
    
    id = Column(Integer, primary_key=True, index=True)
    imei = Column(String(15), unique=True, index=True)
    iccid = Column(String(20), unique=True, index=True)
    orden_produccion_id = Column(Integer, ForeignKey("ordenes_produccion.id"))
    lote_id = Column(Integer, ForeignKey("lotes_produccion.id"))
    operario_id = Column(Integer, ForeignKey("operarios.id"))
    version_producto_id = Column(Integer, ForeignKey("versiones_producto.id"))
    es_oem = Column(Boolean, default=False)
    control_activo = Column(Boolean, default=True)
    bloqueado = Column(Boolean, default=False)
