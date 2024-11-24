#!/bin/bash
# setup_postgres.sh

echo "Setting up PostgreSQL..."

# Instalar PostgreSQL si no está instalado
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
fi

# Iniciar PostgreSQL si no está corriendo
if ! systemctl is-active --quiet postgresql; then
    echo "Starting PostgreSQL service..."
    sudo systemctl start postgresql
fi

# Crear usuario y base de datos
echo "Creating database and user..."
sudo -u postgres psql << EOF
CREATE USER "user" WITH PASSWORD 'password';
CREATE DATABASE production;
GRANT ALL PRIVILEGES ON DATABASE production TO "user";
ALTER USER "user" WITH SUPERUSER;
EOF

# Permitir conexiones locales
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf
echo "host    all             all             127.0.0.1/32            md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf
echo "host    all             all             ::1/128                 md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf

# Reiniciar PostgreSQL para aplicar cambios
sudo systemctl restart postgresql

echo "PostgreSQL setup completed!"
