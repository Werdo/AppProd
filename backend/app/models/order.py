from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    description = Column(String(255))
    
    # Cantidades
    total_quantity = Column(Integer)
    produced_quantity = Column(Integer, default=0)
    
    # Estado
    status = Column(String(20), default="pending")
    priority = Column(Integer, default=0)
    is_oem = Column(Boolean, default=False)
    
    # Relaciones
    devices = relationship("Device", back_populates="order")
    boxes = relationship("Box", back_populates="order")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Usuario que creó la orden
    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_by = relationship("User", back_populates="orders")