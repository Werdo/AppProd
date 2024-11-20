from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    imei = Column(String(15), unique=True, index=True)
    iccid = Column(String(20), unique=True, index=True)
    
    # Relaciones
    order_id = Column(Integer, ForeignKey("orders.id"))
    order = relationship("Order", back_populates="devices")
    
    box_id = Column(Integer, ForeignKey("export_boxes.id"), nullable=True)
    box = relationship("ExportBox", back_populates="devices")
    
    # Estado y control
    status = Column(String(20), default="registered")
    is_oem = Column(Boolean, default=False)
    control_active = Column(Boolean, default=True)
    blocked = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Registros de proceso
    process_records = relationship("ProcessRecord", back_populates="device")