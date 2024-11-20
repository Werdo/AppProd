#!/bin/bash

# Variables de configuración
INSTALL_DIR="/opt/production_system"
LOG_DIR="/var/log/production_system"
DB_NAME="production_db"
DB_USER="production_user"
DB_PASS="secure_password"
DOMAIN="production.example.com"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_DIR/install.log"
}

# Crear directorios de logs
mkdir -p "$LOG_DIR"
chmod 755 "$LOG_DIR"

# Actualizar sistema
log "Actualizando sistema..."
apt update && apt upgrade -y

# Instalar dependencias
log "Instalando dependencias..."
apt install -y \
    docker.io \
    docker-compose \
    nginx \
    postgresql \
    supervisor \
    python3-pip \
    python3-venv \
    git \
    cups \
    ufw \
    fail2ban

# Configurar firewall
log "Configurando firewall..."
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 5432/tcp  # PostgreSQL
ufw allow 631/tcp   # CUPS
ufw --force enable

# Crear estructura de directorios
log "Creando estructura de directorios..."
./create_structure.sh "$INSTALL_DIR"

# Configurar servicios
log "Configurando servicios..."
./configure_services.sh

# Configurar base de datos
log "Configurando base de datos..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Configurar entorno virtual y dependencias
log "Configurando entorno Python..."
python3 -m venv "$INSTALL_DIR/venv"
source "$INSTALL_DIR/venv/bin/activate"
pip install -r "$INSTALL_DIR/requirements/prod.txt"

# Configurar variables de entorno
log "Configurando variables de entorno..."
cat > "$INSTALL_DIR/.env" << EOL
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost/$DB_NAME
DOMAIN=$DOMAIN
SECRET_KEY=$(openssl rand -hex 32)
ENVIRONMENT=production
EOL

# Ejecutar migraciones
log "Ejecutando migraciones..."
cd "$INSTALL_DIR"
alembic upgrade head

log "Instalación completada"