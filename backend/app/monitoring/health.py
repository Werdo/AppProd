from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.core.config import settings
import psutil
import requests

router = APIRouter()

@router.get("/health")
async def health_check(db: Session = Depends(deps.get_db)):
    health_status = {
        "status": "healthy",
        "services": {
            "database": check_database(db),
            "printer_service": check_printer_service(),
            "system": check_system_resources()
        }
    }
    return health_status

def check_database(db: Session) -> dict:
    try:
        db.execute("SELECT 1")
        return {"status": "up", "latency_ms": 0}
    except Exception as e:
        return {"status": "down", "error": str(e)}

def check_printer_service() -> dict:
    try:
        response = requests.get(
            f"{settings.PRINTER_SERVICE_URL}/health",
            timeout=5
        )
        return {
            "status": "up" if response.status_code == 200 else "down",
            "latency_ms": response.elapsed.total_seconds() * 1000
        }
    except Exception as e:
        return {"status": "down", "error": str(e)}

def check_system_resources() -> dict:
    return {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage('/').percent
    }