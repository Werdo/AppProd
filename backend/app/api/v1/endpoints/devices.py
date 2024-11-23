from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.device import DeviceCreate, Device
from app.services.device_service import DeviceService

router = APIRouter()

@router.post("/", response_model=Device)
def create_device(
    *,
    db: Session = Depends(deps.get_db),
    device_in: DeviceCreate,
    current_user = Depends(deps.get_current_user)
):
    """
    Register a new device from QR scan.
    """
    service = DeviceService(db)
    return service.create(device_in, current_user.id)

@router.get("/{imei}", response_model=Device)
def read_device(
    *,
    db: Session = Depends(deps.get_db),
    imei: str
):
    """
    Get device by IMEI.
    """
    service = DeviceService(db)
    device = service.get_by_imei(imei)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@router.get("/validate/{imei}/{process_id}")
def validate_device_process(
    *,
    db: Session = Depends(deps.get_db),
    imei: str,
    process_id: int
):
    """
    Validate if device can proceed to next process.
    """
    service = DeviceService(db)
    return {"valid": service.validate_process(imei, process_id)}