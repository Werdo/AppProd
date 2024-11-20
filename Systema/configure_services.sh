#!/bin/bash
# scripts/setup/configure_services.sh

# Configurar Docker
configure_docker() {
    systemctl enable docker
    systemctl start docker
    usermod -aG docker www-data
}

# Configurar CUPS
configure_cups() {
    # Configurar CUPS para acceso remoto
    cupsctl --remote-admin --remote-any
    systemctl restart cups
}

# Configurar Nginx
configure_nginx() {
    # Copiar configuración de Nginx
    cp services/nginx/nginx.conf /etc/nginx/conf.d/production.conf
    nginx -t && systemctl restart nginx
}

# Configurar Supervisor
configure_supervisor() {
    # Copiar configuración de Supervisor
    cp services/supervisor/supervisord.conf /etc/supervisor/conf.d/production.conf
    supervisorctl reread
    supervisorctl update
}

# Ejecutar configuraciones
configure_docker
configure_cups
configure_nginx
configure_supervisor