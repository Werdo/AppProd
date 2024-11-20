#!/bin/bash
# Wait for database
echo "Waiting for database..."
while ! nc -z db 5432; do
    sleep 0.1
done
echo "Database started"

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Start application
if [ "$ENVIRONMENT" = "development" ]; then
    echo "Starting development server..."
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
else
    echo "Starting production server..."
    gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
fi