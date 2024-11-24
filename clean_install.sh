#!/bin/bash
# clean_install.sh

echo "Starting clean installation..."

# Variables
BASE_DIR="/opt/production_system/AppProd"
BACKEND_DIR="$BASE_DIR/backend"

# Limpiar instalación anterior
echo "Cleaning previous installation..."
rm -rf $BACKEND_DIR/venv
rm -rf $BACKEND_DIR/migrations
rm -rf $BACKEND_DIR/app/models/*
rm -rf $BACKEND_DIR/alembic.ini

# Crear estructura básica
echo "Creating directory structure..."
mkdir -p $BACKEND_DIR/{app,migrations}
mkdir -p $BACKEND_DIR/app/{models,schemas,api,core,services}

# Crear nuevo entorno virtual
echo "Creating virtual environment..."
cd $BACKEND_DIR
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
echo "Installing dependencies..."
pip install --upgrade pip
pip install fastapi==0.104.1 \
    uvicorn==0.24.0 \
    sqlalchemy==2.0.23 \
    psycopg2-binary==2.9.9 \
    python-dotenv==1.0.0 \
    pydantic==2.4.2 \
    alembic==1.12.1

# Crear modelos base
echo "Creating base models..."

# Crear __init__.py para models
cat > $BACKEND_DIR/app/models/__init__.py << 'EOF'
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from app.models.ordenes_produccion import OrdenProduccion
from app.models.lotes_produccion import LoteProduccion
from app.models.operarios import Operario
from app.models.versiones_producto import VersionProducto
from app.models.devices import Device
EOF

# Crear modelo OrdenProduccion
cat > $BACKEND_DIR/app/models/ordenes_produccion.py << 'EOF'
from sqlalchemy import Column, Integer, String, Date, DateTime
from app.models import Base
from datetime import datetime

class OrdenProduccion(Base):
    __tablename__ = "ordenes_produccion"
    
    id = Column(Integer, primary_key=True, index=True)
    numero_orden = Column(String(50), unique=True, index=True)
    cantidad_total = Column(Integer, nullable=False)
    cantidad_producida = Column(Integer, default=0)
    estado = Column(String(20), default='PENDIENTE')
    cliente = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
EOF

# Crear modelo LoteProduccion
cat > $BACKEND_DIR/app/models/lotes_produccion.py << 'EOF'
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.models import Base

class LoteProduccion(Base):
    __tablename__ = "lotes_produccion"
    
    id = Column(Integer, primary_key=True, index=True)
    codigo_lote = Column(String(20), unique=True, nullable=False)
    orden_produccion_id = Column(Integer, ForeignKey('ordenes_produccion.id'))
    fecha = Column(Date, nullable=False)
    numero_secuencial = Column(Integer, nullable=False)
    letra_control = Column(String(1), nullable=False)
EOF

# Crear modelo Operario
cat > $BACKEND_DIR/app/models/operarios.py << 'EOF'
from sqlalchemy import Column, Integer, String, Boolean
from app.models import Base

class Operario(Base):
    __tablename__ = "operarios"
    
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), unique=True, index=True)
    nombre = Column(String(100))
    activo = Column(Boolean, default=True)
EOF

# Crear modelo VersionProducto
cat > $BACKEND_DIR/app/models/versiones_producto.py << 'EOF'
from sqlalchemy import Column, Integer, String, Boolean
from app.models import Base

class VersionProducto(Base):
    __tablename__ = "versiones_producto"
    
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(4), nullable=False)
    descripcion = Column(String(100))
    es_oem = Column(Boolean, default=False)
    activo = Column(Boolean, default=True)
EOF

# Crear modelo Device
cat > $BACKEND_DIR/app/models/devices.py << 'EOF'
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

# Configurar Alembic
echo "Configuring Alembic..."
alembic init migrations

# Actualizar alembic.ini
sed -i "s|sqlalchemy.url = driver://user:pass@localhost/dbname|sqlalchemy.url = postgresql://user:password@localhost:5432/production|g" $BACKEND_DIR/alembic.ini

# Actualizar env.py
cat > $BACKEND_DIR/migrations/env.py << 'EOF'
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import os
import sys
from pathlib import Path

# Añadir el directorio raíz al PATH
base_path = Path(__file__).resolve().parents[1]
sys.path.append(str(base_path))

# Importar los modelos
from app.models import Base

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def get_url():
    return "postgresql://user:password@localhost:5432/production"

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

echo "Installation completed!"
echo "Now you can run: alembic revision --autogenerate -m 'Initial migration'"
