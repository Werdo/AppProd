#!/bin/bash
# setup_database.sh

echo "Setting up PostgreSQL database..."

# Asegurar que PostgreSQL está instalado y corriendo
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
fi

# Iniciar PostgreSQL si no está corriendo
if ! systemctl is-active --quiet postgresql; then
    echo "Starting PostgreSQL..."
    sudo systemctl start postgresql
fi

# Crear usuario y base de datos
echo "Creating user and database..."
sudo -u postgres psql << EOF
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'user') THEN
        CREATE USER "user" WITH PASSWORD 'password';
    END IF;
END
\$\$;

DROP DATABASE IF EXISTS production;
CREATE DATABASE production;
GRANT ALL PRIVILEGES ON DATABASE production TO "user";
ALTER USER "user" WITH SUPERUSER;
EOF

# Configurar pg_hba.conf para permitir conexiones con contraseña
sudo sed -i 's/local   all             all                                     peer/local   all             all                                     md5/' /etc/postgresql/*/main/pg_hba.conf
sudo sed -i 's/host    all             all             127.0.0.1\/32            scram-sha-256/host    all             all             127.0.0.1\/32            md5/' /etc/postgresql/*/main/pg_hba.conf

# Reiniciar PostgreSQL
sudo systemctl restart postgresql

echo "Database setup completed!"
