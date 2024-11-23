from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timedelta

from app.models.device import Device
from app.models.order import Order
from app.schemas.device import DeviceCreate, DeviceUpdate
from app.utils.validators import validate_imei_iccid

class DeviceService:
    def __init__(self, db: Session):
        self.db = db

    async def create_device(self, device_create: DeviceCreate) -> Device:
        """Create new device"""
        # Validar IMEI e ICCID
        if not validate_imei_iccid(device_create.imei, device_create.iccid):
            raise HTTPException(
                status_code=400,
                detail="Invalid IMEI or ICCID format"
            )

        # Verificar duplicados
        exists = self.db.query(Device).filter(
            (Device.imei == device_create.imei) |
            (Device.iccid == device_create.iccid)
        ).first()
        if exists:
            raise HTTPException(
                status_code=400,
                detail="Device with this IMEI or ICCID already exists"
            )

        # Verificar orden de producción
        order = self.db.query(Order).filter(
            Order.id == device_create.order_id,
            Order.status.in_(["pending", "in_progress"])
        ).first()
        if not order:
            raise HTTPException(
                status_code=400,
                detail="Invalid or completed production order"
            )

        # Crear dispositivo
        db_device = Device(**device_create.dict())
        self.db.add(db_device)
        
        # Actualizar contador de orden
        order.produced_quantity += 1
        if order.produced_quantity == order.total_quantity:
            order.status = "completed"
            order.completed_at = datetime.utcnow()
        elif order.status == "pending":
            order.status = "in_progress"
            order.started_at = datetime.utcnow()

        try:
            self.db.commit()
            self.db.refresh(db_device)
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error creating device: {str(e)}"
            )

        return db_device

    async def get_device_by_imei(self, imei: str) -> Optional[Device]:
        """Get device by IMEI"""
        return self.db.query(Device).filter(Device.imei == imei).first()

    async def update_device(
        self,
        device_id: int,
        device_update: DeviceUpdate
    ) -> Device:
        """Update device status"""
        device = self.db.query(Device).filter(Device.id == device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")

        for field, value in device_update.dict(exclude_unset=True).items():
            setattr(device, field, value)

        try:
            self.db.commit()
            self.db.refresh(device)
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error updating device: {str(e)}"
            )

        return device

    async def get_active_orders_count(self) -> int:
        """Get count of active production orders"""
        return self.db.query(Order).filter(
            Order.status.in_(["pending", "in_progress"])
        ).count()

    async def get_devices_produced_today(self) -> int:
        """Get count of devices produced today"""
        today_start = datetime.now().replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        return self.db.query(Device).filter(
            Device.created_at >= today_start
        ).count()

    async def get_production_efficiency(self) -> float:
        """Calculate production efficiency"""
        last_week = datetime.now() - timedelta(days=7)
        devices = self.db.query(Device).filter(
            Device.created_at >= last_week
        ).all()
        
        total_time = 0
        total_devices = len(devices)
        
        if total_devices == 0:
            return 0.0
        
        for device in devices:
            process_time = sum(
                (record.completed_at - record.created_at).total_seconds()
                for record in device.process_records
                if record.completed_at
            )
            total_time += process_time
        
        return (total_devices * 3600) / (total_time if total_time > 0 else 1)