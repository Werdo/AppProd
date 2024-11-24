#!/bin/bash
# reinit_db.sh

echo "Reinitializing database..."

# Combinar los scripts SQL en uno solo
cat database/init/01_schema.sql database/init/02_functions.sql database/init/03_triggers.sql > database/init/init.sql

# Detener y eliminar contenedores
docker-compose down -v

# Eliminar volúmenes antiguos
docker volume rm $(docker volume ls -q | grep appprod) || true

# Reiniciar la base de datos
docker-compose up -d db

# Esperar a que la base de datos esté lista
echo "Waiting for database to be ready..."
sleep 10

# Verificar que las tablas se crearon
docker-compose exec db psql -U user -d production -c "\dt"

echo "Database reinitialization complete!"
