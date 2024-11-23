#!/bin/bash
# database/scripts/maintenance_db.sh

# Variables
LOG_FILE="/var/log/production_system/db_maintenance.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Vacuum analyze
log "Iniciando VACUUM ANALYZE..."
psql -U $DB_USER -d $DB_NAME -c "VACUUM ANALYZE;"

# Reindex
log "Reindexando tablas..."
psql -U $DB_USER -d $DB_NAME -c "REINDEX DATABASE $DB_NAME;"

# Actualizar estadísticas
log "Actualizando estadísticas..."
psql -U $DB_USER -d $DB_NAME -c "ANALYZE VERBOSE;"

# Verificar conexiones activas
log "Conexiones activas:"
psql -U $DB_USER -d $DB_NAME -c "
SELECT datname, usename, client_addr, state 
FROM pg_stat_activity 
WHERE datname = '$DB_NAME';"

# Verificar tamaño de las tablas
log "Tamaño de las tablas:"
psql -U $DB_USER -d $DB_NAME -c "
SELECT schemaname, relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_stat_user_tables 
ORDER BY pg_total_relation_size(relid) DESC;"