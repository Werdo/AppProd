#!/bin/bash
# scripts/setup/create_structure.sh

# Crear estructura de directorios
create_structure() {
    local BASE_DIR=$1
    
    mkdir -p $BASE_DIR/{scripts/{setup,maintenance,services},backend,frontend,database/{init,backups},services/{nginx,supervisor,cups},docker,docs/{installation,configuration,maintenance}}
    
    # Crear archivos necesarios
    touch $BASE_DIR/.env
    touch $BASE_DIR/docker-compose.yml
    
    # Crear archivos de configuración básicos
    echo "worker_processes auto;" > $BASE_DIR/services/nginx/nginx.conf
    echo "[supervisord]" > $BASE_DIR/services/supervisor/supervisord.conf
    
    # Crear scripts básicos
    for script in start stop restart; do
        touch $BASE_DIR/scripts/services/${script}_services.sh
        chmod +x $BASE_DIR/scripts/services/${script}_services.sh
    done
}

# Verificar argumentos
if [ -z "$1" ]; then
    echo "Uso: $0 <directorio_base>"
    exit 1
fi

create_structure $1