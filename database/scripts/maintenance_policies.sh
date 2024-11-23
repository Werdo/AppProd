#!/bin/bash
# database/scripts/maintenance_policies.sh

# Variables de configuración
DB_NAME="production_db"
DB_USER="admin"
LOG_DIR="/var/log/production_system/database"
RETENTION_DAYS=90
VACUUM_THRESHOLD=20

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_DIR/maintenance.log"
}

# Crear directorio de logs si no existe
mkdir -p "$LOG_DIR"

# Función para limpiar datos antiguos
cleanup_old_data() {
    log "Iniciando limpieza de datos antiguos..."
    
    psql -U "$DB_USER" -d "$DB_NAME" <<EOF
    -- Eliminar registros de auditoría antiguos
    DELETE FROM audit.cambios_dispositivos 
    WHERE fecha_cambio < NOW() - INTERVAL '$RETENTION_DAYS days';

    -- Archivar órdenes de producción completadas
    INSERT INTO production.ordenes_produccion_archivo
    SELECT * FROM production.ordenes_produccion
    WHERE completed_at < NOW() - INTERVAL '$RETENTION_DAYS days';

    DELETE FROM production.ordenes_produccion
    WHERE completed_at < NOW() - INTERVAL '$RETENTION_DAYS days';
EOF
    
    log "Limpieza completada"
}

# Función para mantenimiento de índices
maintain_indexes() {
    log "Iniciando mantenimiento de índices..."
    
    psql -U "$DB_USER" -d "$DB_NAME" <<EOF
    -- Reindexar tablas fragmentadas
    SELECT schemaname, tablename, indexname 
    FROM pg_catalog.pg_tables t
    LEFT JOIN pg_catalog.pg_indexes i 
    ON t.schemaname = i.schemaname AND t.tablename = i.tablename
    WHERE t.schemaname NOT IN ('pg_catalog', 'information_schema')
    AND i.indexname IS NOT NULL;

    -- Recolectar estadísticas
    ANALYZE VERBOSE;
EOF
    
    log "Mantenimiento de índices completado"
}

# Función para verificar y optimizar el rendimiento
check_performance() {
    log "Verificando rendimiento de la base de datos..."
    
    psql -U "$DB_USER" -d "$DB_NAME" <<EOF
    -- Identificar tablas que necesitan vacuum
    SELECT schemaname, tablename, n_dead_tup, n_live_tup,
           round(n_dead_tup * 100.0 / nullif(n_live_tup, 0), 1) as dead_percentage
    FROM pg_stat_user_tables
    WHERE n_dead_tup > 0
    ORDER BY dead_percentage DESC;

    -- Identificar índices no utilizados
    SELECT schemaname, tablename, indexname, idx_scan
    FROM pg_stat_user_indexes
    WHERE idx_scan = 0
    AND schemaname NOT IN ('pg_catalog', 'information_schema');

    -- Identificar consultas lentas
    SELECT datname, usename, pid, query_start, state, query
    FROM pg_stat_activity
    WHERE state = 'active'
    AND (now() - query_start) > interval '5 minutes';
EOF
    
    log "Verificación de rendimiento completada"
}

# Ejecutar funciones de mantenimiento
cleanup_old_data
maintain_indexes
check_performance