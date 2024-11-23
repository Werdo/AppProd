from typing import Callable
from fastapi import FastAPI
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.core.config import settings

def create_start_app_handler(app: FastAPI) -> Callable:
    async def start_app() -> None:
        # Inicializar servicios necesarios al inicio
        pass
    
    return start_app

def create_stop_app_handler(app: FastAPI) -> Callable:
    async def stop_app() -> None:
        # Limpiar recursos al detener la aplicación
        pass
    
    return stop_app

def init_app(app: FastAPI) -> None:
    app.add_event_handler("startup", create_start_app_handler(app))
    app.add_event_handler("shutdown", create_stop_app_handler(app))