from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.box import BoxCreate, Box, MasterBoxCreate
from app.services.box_service import BoxService

router = APIRouter()

@router.post("/export-box/", response_model=Box)
def create_export_box(
    *,
    db: Session = Depends(deps.get_db),
    box_in: BoxCreate,
    current_user = Depends(deps.get_current_user)
):
    """
    Create new export box.
    """
    service = BoxService(db)
    return service.create_export_box(box_in, current_user.id)

@router.post("/export-box/{box_id}/add-device")
def add_device_to_box(
    *,
    db: Session = Depends(deps.get_db),
    box_id: int,
    imei: str,
    current_user = Depends(deps.get_current_user)
):
    """
    Add device to export box.
    """
    service = BoxService(db)
    return service.add_device_to_box(box_id, imei, current_user.id)

@router.post("/master-box/", response_model=Box)
def create_master_box(
    *,
    db: Session = Depends(deps.get_db),
    box_in: MasterBoxCreate,
    current_user = Depends(deps.get_current_user)
):
    """
    Create master box from export boxes.
    """
    service = BoxService(db)
    return service.create_master_box(box_in, current_user.id)