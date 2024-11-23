from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from app.api import deps
from app.services.report_service import ReportService
from app.models.user import User

router = APIRouter()

@router.get("/production")
async def get_production_report(
    start_date: datetime,
    end_date: datetime,
    format: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Generate production report"""
    service = ReportService(db)
    report = await service.generate_production_report(start_date, end_date)
    
    if format:
        file_path = await service.export_report(report, format)
        return FileResponse(
            file_path,
            filename=f"production_report_{start_date.date()}_{end_date.date()}.{format}"
        )
    
    return report

@router.get("/efficiency")
async def get_efficiency_report(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get efficiency metrics"""
    service = ReportService(db)
    return await service.generate_efficiency_report()

@router.get("/quality")
async def get_quality_report(
    start_date: datetime,
    end_date: datetime,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Generate quality report"""
    service = ReportService(db)
    return await service.generate_quality_report(start_date, end_date)