#!/bin/bash

# Variables de configuración
LOG_DIR="/var/log/production_system"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_DIR/services.log"
}

# Función para detener servicios de manera segura
stop_service() {
    local service=$1
    log "Deteniendo servicio: $service"
    systemctl stop "$service"
    if [ $? -eq 0 ]; then
        log "Servicio $service detenido correctamente"
        return 0
    else
        log "Error deteniendo servicio $service"
        return 1
    fi
}

# Detener servicios de aplicación
stop_app_services() {
    log "Deteniendo servicios de aplicación..."
    
    # Detener procesos de supervisor primero
    supervisorctl stop all
    stop_service supervisor
    
    # Detener Nginx
    stop_service nginx
}

# Detener servicios base
stop_base_services() {
    log "Deteniendo servicios base..."
    
    # Detener CUPS
    stop_service cups
    
    # Detener Redis si está en uso
    stop_service redis
    
    # Detener PostgreSQL al final
    stop_service postgresql
}

# Función principal de detención
main() {
    log "Iniciando proceso de detención de servicios..."
    
    # Detener servicios en orden inverso
    stop_app_services
    stop_base_services
    
    log "Todos los servicios detenidos"
}

main "$@"