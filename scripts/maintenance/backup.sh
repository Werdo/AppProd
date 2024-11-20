#!/bin/bash

# Variables de configuración
BACKUP_DIR="/opt/production_system/backup"
DB_NAME="production_db"
DB_USER="production_user"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Crear directorio de backup
mkdir -p "$BACKUP_DIR"/{database,files}

# Backup de base de datos
pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/database/db_$TIMESTAMP.sql.gz"

# Backup de archivos
tar -czf "$BACKUP_DIR/files/files_$TIMESTAMP.tar.gz" \
    /opt/production_system/frontend/dist \
    /opt/production_system/backend/app \
    /opt/production_system/.env

# Backup de configuraciones
tar -czf "$BACKUP_DIR/files/configs_$TIMESTAMP.tar.gz" \
    /etc/nginx/sites-available/production \
    /etc/supervisor/conf.d/production.conf \
    /etc/cups/cupsd.conf

# Limpiar backups antiguos
find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete

echo "Backup completado: $TIMESTAMP"