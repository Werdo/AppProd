#!/bin/bash
# database/scripts/monitor_advanced.sh

# Variables
ALERT_THRESHOLD_CONNECTIONS=80
ALERT_THRESHOLD_STORAGE=85
NOTIFY_EMAIL="admin@example.com"

# Monitorear conexiones
monitor_connections() {
    local max_conn=$(psql -t -c "SHOW max_connections;")
    local current_conn=$(psql -t -c "SELECT count(*) FROM pg_stat_activity;")
    local percent=$((current_conn * 100 / max_conn))
    
    if [ $percent -gt $ALERT_THRESHOLD_CONNECTIONS ]; then
        echo "ALERTA: Uso de conexiones al $percent%" | mail -s "DB Connection Alert" $NOTIFY_EMAIL
    fi
}

# Monitorear almacenamiento
monitor_storage() {
    local db_size=$(psql -t -c "
        SELECT pg_size_pretty(pg_database_size('$DB_NAME'));
    ")
    
    local table_sizes=$(psql -t -c "
        SELECT schemaname || '.' || tablename as table,
               pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) as size
        FROM pg_tables
        WHERE schemaname = 'production'
        ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
        LIMIT 10;
    ")
    
    echo "Tamaño de la base de datos: $db_size"
    echo "Top 10 tablas más grandes:"
    echo "$table_sizes"
}

# Monitorear rendimiento de consultas
monitor_queries() {
    psql -t -c "
        SELECT pid, now() - query_start as duration, query
        FROM pg_stat_activity
        WHERE state = 'active'
        AND query NOT LIKE '%pg_stat_activity%'
        ORDER BY duration DESC
        LIMIT 5;
    "
}

# Ejecutar monitoreo
monitor_connections
monitor_storage
monitor_queries