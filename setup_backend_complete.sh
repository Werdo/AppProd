#!/bin/bash
# setup_backend_complete.sh

echo "Setting up backend environment..."

# Variables
BASE_DIR="/opt/production_system/AppProd/backend"
VENV_DIR="$BASE_DIR/venv"

# Asegurar que el usuario tiene permisos
if [ ! -w "/opt/production_system/AppProd" ]; then
    echo "Error: No tienes permisos de escritura en el directorio."
    echo "Ejecutando con sudo..."
    sudo chown -R $USER:$USER /opt/production_system/AppProd
fi

# Instalar python3-venv y pip
echo "Instalando dependencias necesarias..."
sudo apt-get update
sudo apt-get install -y python3-venv python3-pip

# Verificar la versión de Python instalada
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "Python version detected: $PYTHON_VERSION"

# Limpiar el entorno virtual existente si existe
if [ -d "$VENV_DIR" ]; then
    echo "Eliminando entorno virtual anterior..."
    rm -rf "$VENV_DIR"
fi

# Crear y activar entorno virtual
echo "Creando entorno virtual..."
python3 -m venv $VENV_DIR
source $VENV_DIR/bin/activate

# Actualizar pip dentro del entorno virtual
echo "Actualizando pip..."
python3 -m pip install --upgrade pip

# Instalar dependencias
echo "Instalando dependencias..."
pip install -r $BASE_DIR/requirements.txt

# Actualizar los modelos
mkdir -p $BASE_DIR/app/models
cat > $BASE_DIR/app/models/__init__.py << 'EOF'
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from app.models.device import Device
# Import other models here
EOF

# Crear modelo Device
cat > $BASE_DIR/app/models/device.py << 'EOF'
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from app.models import Base
from datetime import datetime

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    imei = Column(String(15), unique=True, index=True)
    iccid = Column(String(20), unique=True, index=True)
    orden_produccion_id = Column(Integer, ForeignKey("ordenes_produccion.id"))
    lote_id = Column(Integer, ForeignKey("lotes_produccion.id"))
    operario_id = Column(Integer, ForeignKey("operarios.id"))
    version_producto_id = Column(Integer, ForeignKey("versiones_producto.id"))
    es_oem = Column(Boolean, default=False)
    control_activo = Column(Boolean, default=True)
    bloqueado = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
EOF

# Crear el directorio migrations si no existe
mkdir -p $BASE_DIR/migrations

# Actualizar el archivo env.py de alembic
cat > $BASE_DIR/migrations/env.py << 'EOF'
from logging.config import fileConfig
import os
import sys

# Añadir el directorio del proyecto al PATH
current_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(current_path)

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Importar Base y modelos
from app.models import Base
from app.core.config import get_settings

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def get_url():
    return "postgresql://user:password@db:5432/production"

def run_migrations_offline() -> None:
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = get_url()
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
EOF

# Crear core/config.py si no existe
mkdir -p $BASE_DIR/app/core
cat > $BASE_DIR/app/core/config.py << 'EOF'
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@db:5432/production"
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
EOF

# Establecer permisos correctos
echo "Estableciendo permisos..."
chmod -R 755 $BASE_DIR
find $BASE_DIR -type f -exec chmod 644 {} \;
chmod +x $BASE_DIR/app/main.py

# Crear script de activación
cat > $BASE_DIR/activate.sh << EOF
#!/bin/bash
source $VENV_DIR/bin/activate
EOF
chmod +x $BASE_DIR/activate.sh

echo "Backend setup completed successfully!"
echo "To activate the virtual environment, run:"
echo "source $BASE_DIR/activate.sh"

# Activar el entorno virtual para el usuario actual
source $VENV_DIR/bin/activate
