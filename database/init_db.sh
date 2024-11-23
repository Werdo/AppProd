#!/bin/bash
# database/scripts/init_db.sh

set -e

# Variables de configuración
DB_USER=${POSTGRES_USER:-admin}
DB_PASSWORD=${POSTGRES_PASSWORD:-secure_password}
DB_NAME=${POSTGRES_DB:-production_db}

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Crear usuario y base de datos
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    CREATE DATABASE $DB_NAME;
    GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOSQL

# Ejecutar scripts de inicialización en orden
for file in /docker-entrypoint-initdb.d/*.sql; do
    log "Ejecutando $file..."
    psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" -f "$file"
done

log "Inicialización de base de datos completada"