from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
import uuid

from app.models.box import Box, ExportBox, MasterBox
from app.models.device import Device
from app.schemas.box import ExportBoxCreate, MasterBoxCreate

class BoxService:
    def __init__(self, db: Session):
        self.db = db

    async def create_export_box(self, box_create: ExportBoxCreate) -> ExportBox:
        """Create new export box"""
        box = ExportBox(
            code=f"EXP-{uuid.uuid4().hex[:8].upper()}",
            order_id=box_create.order_id
        )
        
        self.db.add(box)
        try:
            self.db.commit()
            self.db.refresh(box)
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error creating export box: {str(e)}"
            )
        
        return box

    async def add_device_to_box(
        self,
        box_id: int,
        device_id: int
    ) -> ExportBox:
        """Add device to export box"""
        box = self.db.query(ExportBox).filter(
            ExportBox.id == box_id,
            ExportBox.status == "in_progress"
        ).first()
        
        if not box:
            raise HTTPException(
                status_code=404,
                detail="Export box not found or already completed"
            )
            
        if box.current_devices >= box.max_devices:
            raise HTTPException(
                status_code=400,
                detail="Box is full"
            )
            
        device = self.db.query(Device).filter(Device.id == device_id).first()
        if not device:
            raise HTTPException(
                status_code=404,
                detail="Device not found"
            )
            
        if device.box_id:
            raise HTTPException(
                status_code=400,
                detail="Device already assigned to a box"
            )
            
        device.box_id = box.id
        box.current_devices += 1
        
        if box.current_devices == box.max_devices:
            box.status = "completed"
            box.completed_at = datetime.utcnow()
            
        try:
            self.db.commit()
            self.db.refresh(box)
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error adding device to box: {str(e)}"
            )
            
        return box

    async def create_master_box(
        self,
        box_create: MasterBoxCreate
    ) -> MasterBox:
        """Create master box from export boxes"""
        # Verificar cajas expositoras
        export_boxes = self.db.query(ExportBox).filter(
            ExportBox.id.in_(box_create.export_box_ids),
            ExportBox.status == "completed",
            ExportBox.master_box_id.is_(None)
        ).all()
        
        if len(export_boxes) != 4:
            raise HTTPException(
                status_code=400,
                detail="Master box requires exactly 4 completed export boxes"
            )
            
        # Crear caja master
        master_box = MasterBox(
            code=f"MST-{uuid.uuid4().hex[:8].upper()}",
            order_id=box_create.order_id
        )
        
        self.db.add(master_box)
        
        # Asignar cajas expositoras
        for box in export_boxes:
            box.master_box_id = master_box.id
            master_box.current_export_boxes += 1
            
        master_box.status = "completed"
        master_box.completed_at = datetime.utcnow()
        
        try:
            self.db.commit()
            self.db.refresh(master_box)
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error creating master box: {str(e)}"
            )
            
        return master_box

    async def get_completed_boxes_count(self) -> dict:
        """Get count of completed boxes by type"""
        export_count = self.db.query(ExportBox).filter(
            ExportBox.status == "completed"
        ).count()
        
        master_count = self.db.query(MasterBox).filter(
            MasterBox.status == "completed"
        ).count()
        
        return {
            "export_boxes": export_count,
            "master_boxes": master_count
        }