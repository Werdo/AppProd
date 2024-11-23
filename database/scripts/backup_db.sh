#!/bin/bash
# database/scripts/backup_db.sh

# Variables
BACKUP_DIR="/opt/production_system/database/backups"
BACKUP_RETAIN_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

# Backup de la base de datos
pg_dump -h localhost -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Backup de configuración
cp /etc/postgresql/*/main/postgresql.conf $BACKUP_DIR/postgresql_$DATE.conf
cp /etc/postgresql/*/main/pg_hba.conf $BACKUP_DIR/pg_hba_$DATE.conf

# Eliminar backups antiguos
find $BACKUP_DIR -mtime +$BACKUP_RETAIN_DAYS -delete