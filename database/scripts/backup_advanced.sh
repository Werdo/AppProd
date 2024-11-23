#!/bin/bash
# database/scripts/backup_advanced.sh

# Variables
BACKUP_ROOT="/backup/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$DATE"
WEEKS_TO_KEEP=4
DAYS_TO_KEEP=7

# Crear estructura de directorios
mkdir -p "$BACKUP_DIR"/{full,schema,tables}

# Backup completo
pg_dump -Fc -f "$BACKUP_DIR/full/database.dump" "$DB_NAME"

# Backup de solo esquema
pg_dump -s -f "$BACKUP_DIR/schema/schema.sql" "$DB_NAME"

# Backup de tablas específicas
tables=(
    "production.dispositivos"
    "production.registro_procesos"
    "production.ordenes_produccion"
)

for table in "${tables[@]}"; do
    pg_dump -t "$table" -f "$BACKUP_DIR/tables/${table//./}_${DATE}.sql" "$DB_NAME"
done

# Comprimir backup
cd "$BACKUP_ROOT"
tar czf "$DATE.tar.gz" "$DATE"
rm -rf "$DATE"

# Limpiar backups antiguos
find "$BACKUP_ROOT" -name "*.tar.gz" -mtime +$DAYS_TO_KEEP -delete