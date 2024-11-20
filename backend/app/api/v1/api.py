from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    devices,
    boxes,
    production,
    reports,
    printers
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
api_router.include_router(boxes.router, prefix="/boxes", tags=["boxes"])
api_router.include_router(production.router, prefix="/production", tags=["production"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(printers.router, prefix="/printers", tags=["printers"])