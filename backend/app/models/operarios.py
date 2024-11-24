from sqlalchemy import Column, Integer, String, Boolean
from app.models import Base

class Operario(Base):
    __tablename__ = "operarios"
    
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), unique=True, index=True)
    nombre = Column(String(100))
    activo = Column(Boolean, default=True)
