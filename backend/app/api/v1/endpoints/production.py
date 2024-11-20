from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.models.user import User
from app.schemas.order import OrderCreate, Order
from app.services.device_service import DeviceService
from app.services.box_service import BoxService

router = APIRouter()

@router.get("/status")
async def get_production_status(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get current production status"""
    device_service = DeviceService(db)
    box_service = BoxService(db)
    
    return {
        "active_orders": await device_service.get_active_orders_count(),
        "devices_today": await device_service.get_devices_produced_today(),
        "boxes_completed": await box_service.get_completed_boxes_count(),
        "efficiency": await device_service.get_production_efficiency()
    }

@router.post("/orders/", response_model=Order)
async def create_production_order(
    order: OrderCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Create new production order"""
    device_service = DeviceService(db)
    return await device_service.create_order(order)

@router.get("/orders/{order_id}/progress")
async def get_order_progress(
    order_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get production order progress"""
    device_service = DeviceService(db)
    return await device_service.get_order_progress(order_id)