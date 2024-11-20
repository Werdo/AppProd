#!/bin/bash
# scripts/setup/install.sh

# Variables de configuración
PROJECT_ROOT="/opt/production_system"
GITHUB_REPO="https://github.com/tu-usuario/production-system.git"
LOG_FILE="/var/log/production_system/install.log"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Crear directorio de logs
mkdir -p $(dirname $LOG_FILE)

# Actualizar sistema
log "Actualizando sistema..."
apt update && apt upgrade -y

# Instalar dependencias
log "Instalando dependencias..."
apt install -y \
    docker.io \
    docker-compose \
    git \
    nginx \
    supervisor \
    cups \
    postgresql-client \
    python3-pip \
    nodejs \
    npm

# Crear estructura de directorios
log "Creando estructura de directorios..."
mkdir -p $PROJECT_ROOT
cd $PROJECT_ROOT

# Clonar repositorio
log "Clonando repositorio..."
git clone $GITHUB_REPO .

# Configurar permisos
log "Configurando permisos..."
chown -R www-data:www-data $PROJECT_ROOT

# Configurar servicios
log "Configurando servicios..."
./scripts/setup/configure_services.sh

# Iniciar servicios
log "Iniciando servicios..."
./scripts/services/start_services.sh

log "Instalación completada"