#!/bin/bash

BASE_DIR=$1

if [ -z "$BASE_DIR" ]; then
    echo "Uso: $0 <directorio_base>"
    exit 1
fi

# Crear estructura de directorios
mkdir -p "$BASE_DIR"/{frontend,backend,database,services,logs,backup}
mkdir -p "$BASE_DIR/services"/{nginx,supervisor,cups}
mkdir -p "$BASE_DIR/database"/{data,backup}
mkdir -p "$BASE_DIR/logs"/{nginx,app,cups}

# Configurar permisos
chown -R www-data:www-data "$BASE_DIR"
chmod -R 755 "$BASE_DIR"

# Crear archivos de configuración básicos
touch "$BASE_DIR/services/nginx/production.conf"
touch "$BASE_DIR/services/supervisor/production.conf"
touch "$BASE_DIR/.env"

echo "Estructura de directorios creada en $BASE_DIR"