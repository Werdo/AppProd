from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BoxBase(BaseModel):
    order_id: int

class ExportBoxCreate(BoxBase):
    pass

class MasterBoxCreate(BoxBase):
    export_box_ids: List[int]

class BoxInDB(BoxBase):
    id: int
    code: str
    type: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ExportBoxInDB(BoxInDB):
    current_devices: int
    max_devices: int
    master_box_id: Optional[int] = None

class MasterBoxInDB(BoxInDB):
    current_export_boxes: int
    max_export_boxes: int