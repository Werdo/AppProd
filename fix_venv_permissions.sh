#!/bin/bash
# fix_venv_permissions.sh

echo "Fixing virtual environment permissions..."

# Variables
BASE_DIR="/opt/production_system/AppProd/backend"
VENV_DIR="$BASE_DIR/venv"
CURRENT_USER=$(whoami)

# Asegurar que el usuario actual es el propietario del directorio del proyecto
sudo chown -R $CURRENT_USER:$CURRENT_USER $BASE_DIR

# Eliminar el entorno virtual existente
rm -rf $VENV_DIR

# Crear nuevo entorno virtual
python3 -m venv $VENV_DIR

# Establecer permisos correctos
chmod -R 755 $VENV_DIR

# Activar entorno virtual
source $VENV_DIR/bin/activate

# Actualizar pip
pip install --upgrade pip setuptools wheel

# Instalar alembic específicamente primero
pip install alembic==1.12.1

# Instalar el resto de dependencias
pip install -r $BASE_DIR/requirements.txt

# Verificar la instalación de alembic
which alembic

# Establecer permisos ejecutables para los scripts
chmod +x $VENV_DIR/bin/*

# Verificar estructura del proyecto
mkdir -p $BASE_DIR/migrations
touch $BASE_DIR/migrations/__init__.py

# Actualizar alembic.ini
cat > $BASE_DIR/alembic.ini << 'EOF'
[alembic]
script_location = migrations
sqlalchemy.url = postgresql://user:password@db:5432/production

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
EOF

# Actualizar env.py
cat > $BASE_DIR/migrations/env.py << 'EOF'
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

echo "Virtual environment fixed and alembic installed. Try running:"
echo "source $VENV_DIR/bin/activate"
echo "alembic revision --autogenerate -m 'Initial migration'"
