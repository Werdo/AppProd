from pydantic import BaseModel, constr
from typing import Optional
from datetime import datetime

class DeviceBase(BaseModel):
    imei: constr(regex=r'^\d{15}$')
    iccid: constr(regex=r'^\d{19,20}$')
    is_oem: Optional[bool] = False

class DeviceCreate(DeviceBase):
    order_id: int

class DeviceUpdate(BaseModel):
    status: Optional[str] = None
    control_active: Optional[bool] = None
    blocked: Optional[bool] = None

class DeviceInDB(DeviceBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime
    order_id: int
    box_id: Optional[int] = None

    class Config:
        orm_mode = True