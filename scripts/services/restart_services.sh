#!/bin/bash

# Variables de configuración
LOG_DIR="/var/log/production_system"
SCRIPTS_DIR="$(dirname "$0")"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_DIR/services.log"
}

# Función para reiniciar un servicio específico
restart_single_service() {
    local service=$1
    log "Reiniciando servicio: $service"
    systemctl restart "$service"
    if systemctl is-active --quiet "$service"; then
        log "Servicio $service reiniciado correctamente"
        return 0
    else
        log "Error reiniciando servicio $service"
        return 1
    fi
}

# Reinicio controlado de todos los servicios
controlled_restart() {
    log "Iniciando reinicio controlado de servicios..."
    
    # Detener servicios
    "$SCRIPTS_DIR/stop_services.sh"
    if [ $? -ne 0 ]; then
        log "Error durante la detención de servicios"
        return 1
    fi
    
    # Esperar a que todos los procesos se detengan
    sleep 5
    
    # Iniciar servicios
    "$SCRIPTS_DIR/start_services.sh"
    if [ $? -ne 0 ]; then
        log "Error durante el inicio de servicios"
        return 1
    fi
    
    return 0
}

# Reinicio rápido (solo servicios de aplicación)
quick_restart() {
    log "Realizando reinicio rápido..."
    
    # Reiniciar supervisor (aplicación)
    supervisorctl reload
    
    # Reiniciar nginx
    restart_single_service nginx
}

# Reiniciar servicio específico
restart_service() {
    local service=$1
    
    case $service in
        "database")
            restart_single_service postgresql
            ;;
        "web")
            restart_single_service nginx
            ;;
        "app")
            supervisorctl reload
            ;;
        "print")
            restart_single_service cups
            ;;
        *)
            log "Servicio desconocido: $service"
            return 1
            ;;
    esac
}

# Función principal
main() {
    # Procesar argumentos
    case "$1" in
        "quick")
            quick_restart
            ;;
        "full")
            controlled_restart
            ;;
        "service")
            if [ -z "$2" ]; then
                log "Debe especificar un servicio"
                exit 1
            fi
            restart_service "$2"
            ;;
        *)
            echo "Uso: $0 {quick|full|service nombre_servicio}"
            exit 1
            ;;
    esac
    
    # Verificar estado final
    if [ $? -eq 0 ]; then
        log "Reinicio completado exitosamente"
    else
        log "Error durante el reinicio"
        exit 1
    fi
}

main "$@"