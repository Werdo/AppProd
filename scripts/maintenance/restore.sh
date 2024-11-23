#!/bin/bash

if [ -z "$1" ]; then
    echo "Uso: $0 <timestamp_backup>"
    exit 1
fi

TIMESTAMP=$1
BACKUP_DIR="/opt/production_system/backup"
DB_NAME="production_db"
DB_USER="production_user"

# Restaurar base de datos
if [ -f "$BACKUP_DIR/database/db_$TIMESTAMP.sql.gz" ]; then
    echo "Restaurando base de datos..."
    gunzip < "$BACKUP_DIR/database/db_$TIMESTAMP.sql.gz" | psql -U "$DB_USER" "$DB_NAME"
fi

# Restaurar archivos
if [ -f "$BACKUP_DIR/files/files_$TIMESTAMP.tar.gz" ]; then
    echo "Restaurando archivos..."
    tar -xzf "$BACKUP_DIR/files/files_$TIMESTAMP.tar.gz" -C /
fi

# Restaurar configuraciones
if [ -f "$BACKUP_DIR/files/configs_$TIMESTAMP.tar.gz" ]; then
    echo "Restaurando configuraciones..."
    tar -xzf "$BACKUP_DIR/files/configs_$TIMESTAMP.tar.gz" -C /
    
    # Reiniciar servicios
    systemctl restart nginx
    supervisorctl reload
    systemctl restart cups
fi

echo "Restauración completada"