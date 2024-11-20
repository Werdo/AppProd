FROM postgres:15-alpine

# Variables de entorno por defecto
ENV POSTGRES_DB=production_db
ENV POSTGRES_USER=production_user
ENV POSTGRES_PASSWORD=production_password

# Copiar scripts de inicialización
COPY init.sql /docker-entrypoint-initdb.d/

# Configuración personalizada de PostgreSQL
COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY pg_hba.conf /etc/postgresql/pg_hba.conf

# Configurar volumen de datos
VOLUME /var/lib/postgresql/data