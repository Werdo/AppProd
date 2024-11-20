from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Box(Base):
    __tablename__ = "boxes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    type = Column(String(20))  # 'export' or 'master'
    status = Column(String(20), default="in_progress")
    
    order_id = Column(Integer, ForeignKey("orders.id"))
    order = relationship("Order", back_populates="boxes")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    __mapper_args__ = {
        'polymorphic_identity': 'box',
        'polymorphic_on': type
    }

class ExportBox(Box):
    __tablename__ = "export_boxes"

    id = Column(Integer, ForeignKey('boxes.id'), primary_key=True)
    max_devices = Column(Integer, default=24)
    current_devices = Column(Integer, default=0)
    
    devices = relationship("Device", back_populates="box")
    master_box_id = Column(Integer, ForeignKey("master_boxes.id"), nullable=True)
    master_box = relationship("MasterBox", back_populates="export_boxes")
    
    __mapper_args__ = {
        'polymorphic_identity': 'export'
    }

class MasterBox(Box):
    __tablename__ = "master_boxes"

    id = Column(Integer, ForeignKey('boxes.id'), primary_key=True)
    max_export_boxes = Column(Integer, default=4)
    current_export_boxes = Column(Integer, default=0)
    
    export_boxes = relationship("ExportBox", back_populates="master_box")
    
    __mapper_args__ = {
        'polymorphic_identity': 'master'
    }