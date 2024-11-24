#!/bin/bash
# fix_dependencies.sh

echo "Fixing backend dependencies..."

# Activar entorno virtual
source /opt/production_system/AppProd/backend/venv/bin/activate

# Limpiar cache de pip
pip cache purge

# Actualizar pip
pip install --upgrade pip

# Desinstalar todas las dependencias existentes
pip freeze | grep -v "^-e" | xargs -r pip uninstall -y

# Crear nuevo requirements.txt
cat > /opt/production_system/AppProd/backend/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0
pydantic==2.4.2
pydantic-settings==2.1.0
alembic==1.12.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
aiofiles==23.2.1
jinja2==3.1.2
python-dateutil==2.8.2
elasticsearch==8.11.0
redis==5.0.1
httpx==0.25.2
pytest==7.4.3
pytest-asyncio==0.21.1
tenacity==8.2.3
weasyprint==60.1
reportlab==4.0.8
qrcode==7.4.2
python-barcode==0.15.1
fpdf2==2.7.6
typing-extensions>=4.8.0
EOF

# Instalar dependencias
pip install -r /opt/production_system/AppProd/backend/requirements.txt

# Verificar instalación
echo "Verificando instalación..."
pip list

echo "Dependencias instaladas. Intentando ejecutar alembic..."

# Verificar que alembic está disponible
which alembic

# Crear archivo __init__.py vacío
echo "" > /opt/production_system/AppProd/backend/app/__init__.py

# Script completo para alembic
cat > /opt/production_system/AppProd/backend/migrations/env.py << 'EOF'
from logging.config import fileConfig
import os
import sys
from pathlib import Path

# Añadir el directorio raíz del proyecto al PATH
root_path = str(Path(__file__).parents[1].absolute())
sys.path.append(root_path)

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

echo "Configuración completada. Intenta ejecutar: alembic revision --autogenerate -m 'Initial migration'"
