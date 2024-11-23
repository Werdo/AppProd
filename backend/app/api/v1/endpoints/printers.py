from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.services.printer_service import PrinterService
from app.models.user import User
from app.schemas.printer import PrintJob, PrinterStatus

router = APIRouter()

@router.get("/status")
async def get_printer_status(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> List[PrinterStatus]:
    """Get status of all printers"""
    service = PrinterService(db)
    return await service.get_all_printer_status()

@router.post("/print")
async def create_print_job(
    job: PrintJob,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Create new print job"""
    service = PrinterService(db)
    return await service.create_print_job(job)

@router.get("/queue")
async def get_print_queue(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get current print queue"""
    service = PrinterService(db)
    return await service.get_print_queue()

@router.delete("/jobs/{job_id}")
async def cancel_print_job(
    job_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Cancel print job"""
    service = PrinterService(db)
    return await service.cancel_print_job(job_id)