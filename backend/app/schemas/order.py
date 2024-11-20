from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrderBase(BaseModel):
    order_number: str
    description: Optional[str] = None
    total_quantity: int
    is_oem: Optional[bool] = False
    priority: Optional[int] = 0

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[int] = None
    description: Optional[str] = None

class OrderInDB(OrderBase):
    id: int
    status: str
    produced_quantity: int
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_by_id: int

    class Config:
        orm_mode = True