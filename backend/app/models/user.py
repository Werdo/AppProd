from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    
    # Control de acceso
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # QR para login rápido
    qr_code = Column(String, unique=True, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relaciones
    orders = relationship("Order", back_populates="created_by")
    process_records = relationship("ProcessRecord", back_populates="operator")