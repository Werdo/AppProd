#!/bin/bash

LOG_FILE="/var/log/production_system/monitor.log"
ALERT_EMAIL="admin@example.com"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Verificar servicios
check_services() {
    services=("nginx" "supervisor" "cups" "postgresql")
    for service in "${services[@]}"; do
        if ! systemctl is-active --quiet "$service"; then
            log "ERROR: Servicio $service no está activo"
            echo "Servicio $service no está activo" | mail -s "Error de Servicio" "$ALERT_EMAIL"
        fi
    done
}

# Verificar espacio en disco
check_disk_space() {
    usage=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$usage" -gt 90 ]; then
        log "ALERTA: Espacio en disco crítico: $usage%"
        echo "Espacio en disco crítico: $usage%" | mail -s "Alerta de Disco" "$ALERT_EMAIL"
    fi
}

# Verificar memoria
check_memory() {
    memory_free=$(free -m | awk 'NR==2{printf "%.2f", $3*100/$2}')
    if [ "${memory_free%.*}" -gt 90 ]; then
        log "ALERTA: Uso de memoria crítico: $memory_free%"
        echo "Uso de memoria crítico: $memory_free%" | mail -s "Alerta de Memoria" "$ALERT_EMAIL"
    fi
}

# Verificar procesos de aplicación
check_app_processes() {
    if ! pgrep -f "uvicorn" > /dev/null; then
        log "ERROR: Proceso backend no encontrado"
        echo "Proceso backend no encontrado" | mail -s "Error de Proceso" "$ALERT_EMAIL"
    fi

    if ! pgrep -f "npm" > /dev/null; then
        log "ERROR: Proceso frontend no encontrado"
        echo "Proceso frontend no encontrado" | mail -s "Error de Proceso" "$ALERT_EMAIL"
    fi
}

# Verificar conexiones de base de datos
check_database() {
    connections=$(psql -U production_user -d production_db -c "SELECT count(*) FROM pg_stat_activity;" -t)
    if [ "$connections" -gt 100 ]; then
        log "ALERTA: Demasiadas conexiones a la base de datos: $connections"
        echo "Demasiadas conexiones a la base de datos: $connections" | mail -s "Alerta de Base de Datos" "$ALERT_EMAIL"
    fi
}

# Ejecutar todas las verificaciones
check_services
check_disk_space
check_memory
check_app_processes
check_database

log "Monitoreo completado"