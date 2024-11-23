from sqlalchemy.orm import Session

from app.core.config import settings
from app.db import base  # noqa: F401
from app.models.user import User
from app.core.security import get_password_hash

def init_db(db: Session) -> None:
    # Crear usuario admin si no existe
    user = db.query(User).filter_by(email=settings.FIRST_SUPERUSER).first()
    if not user:
        user = User(
            email=settings.FIRST_SUPERUSER,
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            full_name="Initial Admin",
            is_superuser=True,
            is_active=True,
        )
        db.add(user)
        db.commit()

    # Inicializar otras tablas según sea necesario
    initialize_printer_configs(db)
    initialize_process_steps(db)

def initialize_printer_configs(db: Session) -> None:
    # Configuraciones iniciales de impresoras
    pass

def initialize_process_steps(db: Session) -> None:
    # Pasos del proceso de producción
    pass