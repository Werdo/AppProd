#!/bin/bash

# Configurar Nginx
configure_nginx() {
    cat > /etc/nginx/sites-available/production << 'EOL'
server {
    listen 80;
    server_name production.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOL

    ln -sf /etc/nginx/sites-available/production /etc/nginx/sites-enabled/
    nginx -t && systemctl restart nginx
}

# Configurar Supervisor
configure_supervisor() {
    cat > /etc/supervisor/conf.d/production.conf << 'EOL'
[program:backend]
command=/opt/production_system/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
directory=/opt/production_system/backend
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/production_system/backend.err.log
stdout_logfile=/var/log/production_system/backend.out.log

[program:frontend]
command=npm start
directory=/opt/production_system/frontend
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/production_system/frontend.err.log
stdout_logfile=/var/log/production_system/frontend.out.log
EOL

    supervisorctl reread
    supervisorctl update
}

# Configurar CUPS
configure_cups() {
    cat > /etc/cups/cupsd.conf << 'EOL'
LogLevel warn
PageLogFormat
MaxLogSize 0
Listen localhost:631
Listen /var/run/cups/cups.sock
ServerAlias *

<Location />
  Order allow,deny
  Allow all
</Location>

<Location /admin>
  Order allow,deny
  Allow all
</Location>
EOL

    systemctl restart cups
}

# Configurar servicios
configure_nginx
configure_supervisor
configure_cups

echo "Servicios configurados correctamente"