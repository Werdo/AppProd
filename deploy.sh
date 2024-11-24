#!/bin/bash
set -e

echo "Starting deployment..."

# Variables
export PROJECT_DIR="/opt/production_system/AppProd"
DATABASE_DIR="$PROJECT_DIR/database"

# Verificar que los archivos necesarios existen
echo "Checking database configuration files..."
for file in config/postgresql.conf config/pg_hba.conf init/01_schema.sql init/02_functions.sql init/03_triggers.sql; do
    if [ ! -f "$DATABASE_DIR/$file" ]; then
        echo "Error: Missing file $DATABASE_DIR/$file"
        exit 1
    fi
done

# Detener y eliminar contenedores existentes
echo "Stopping existing containers..."
docker-compose down -v

# Limpiar volúmenes
echo "Cleaning volumes..."
docker volume rm $(docker volume ls -q | grep appprod) 2>/dev/null || true

# Reconstruir contenedores
echo "Rebuilding containers..."
docker-compose build

# Iniciar servicios
echo "Starting services..."
docker-compose up -d db

# Esperar a que la base de datos esté lista
echo "Waiting for database to be ready..."
until docker-compose exec -T db pg_isready -U user -d production; do
    echo "Database is unavailable - sleeping"
    sleep 1
done

echo "Database is ready!"

# Verificar que los scripts de inicialización se ejecutaron
echo "Verifying database initialization..."
docker-compose exec -T db psql -U user -d production -c "\dt"

# Iniciar el resto de los servicios
echo "Starting remaining services..."
docker-compose up -d

# Verificar el estado de los servicios
echo "Checking service status..."
docker-compose ps

echo "Deployment completed successfully!"
