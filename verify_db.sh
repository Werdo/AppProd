#!/bin/bash
# verify_db.sh

echo "Stopping current containers..."
docker-compose down -v

echo "Removing old volumes..."
docker volume rm $(docker volume ls -q | grep appprod) 2>/dev/null || true

echo "Verifying script permissions..."
chmod 644 database/init/*.sql
ls -la database/init/

echo "Starting database..."
docker-compose up -d db

echo "Waiting for database to be ready..."
until docker-compose exec -T db pg_isready -U user -d production; do
    echo "Database is unavailable - sleeping"
    sleep 1
done

echo "Verifying database initialization..."
docker-compose exec db psql -U user -d production -c "\dt"

echo "Checking specific tables..."
docker-compose exec db psql -U user -d production -c "\d dispositivos"

echo "Verifying functions..."
docker-compose exec db psql -U user -d production -c "\df"

echo "Checking database logs..."
docker-compose logs db

echo "Verification complete!"
