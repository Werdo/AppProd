#!/bin/bash

# Variables de configuración
APP_DIR="/opt/production_system"
LOG_DIR="/var/log/production_system"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_DIR/services.log"
}

# Función para verificar el estado de un servicio
check_service() {
    if systemctl is-active --quiet $1; then
        log "Servicio $1 está ejecutándose"
        return 0
    else
        log "Error: Servicio $1 no está ejecutándose"
        return 1
    fi
}

# Iniciar servicios base
start_base_services() {
    log "Iniciando servicios base..."
    
    # PostgreSQL
    systemctl start postgresql
    check_service postgresql || return 1
    
    # Redis (si se usa para caché)
    systemctl start redis
    check_service redis || return 1
    
    # CUPS para impresión
    systemctl start cups
    check_service cups || return 1
}

# Iniciar servicios de aplicación
start_app_services() {
    log "Iniciando servicios de aplicación..."
    
    # Nginx
    systemctl start nginx
    check_service nginx || return 1
    
    # Supervisor (gestiona los procesos de la aplicación)
    systemctl start supervisor
    supervisorctl reread
    supervisorctl update
    supervisorctl start all
    check_service supervisor || return 1
}

# Verificar conexión a base de datos
check_database() {
    log "Verificando conexión a base de datos..."
    if pg_isready -d production_db -U production_user; then
        log "Conexión a base de datos establecida"
        return 0
    else
        log "Error: No se puede conectar a la base de datos"
        return 1
    fi
}

# Verificar estado de la aplicación
check_app_health() {
    log "Verificando estado de la aplicación..."
    
    # Verificar API
    if curl -s -f http://localhost:8000/api/v1/health > /dev/null; then
        log "API está respondiendo"
    else
        log "Error: API no responde"
        return 1
    fi
    
    # Verificar Frontend
    if curl -s -f http://localhost:3000 > /dev/null; then
        log "Frontend está respondiendo"
    else
        log "Error: Frontend no responde"
        return 1
    fi
    
    return 0
}

# Función principal de inicio
main() {
    log "Iniciando todos los servicios..."
    
    # Crear directorios de logs si no existen
    mkdir -p "$LOG_DIR"
    chown -R www-data:www-data "$LOG_DIR"
    
    # Iniciar servicios en orden
    start_base_services || {
        log "Error iniciando servicios base"
        return 1
    }
    
    check_database || {
        log "Error con la base de datos"
        return 1
    }
    
    start_app_services || {
        log "Error iniciando servicios de aplicación"
        return 1
    }
    
    # Esperar a que los servicios estén completamente iniciados
    sleep 10
    
    check_app_health || {
        log "Error verificando salud de la aplicación"
        return 1
    }
    
    log "Todos los servicios iniciados correctamente"
    return 0
}

main "$@"