#!/bin/bash
# deploy.sh

# Exit on error
set -e

# Variables
export PROJECT_DIR="/opt/production_system/AppProd"
export COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check requirements
echo "Checking requirements..."
for cmd in docker docker-compose git; do
    if ! command_exists "$cmd"; then
        echo "Error: $cmd is not installed"
        exit 1
    fi
done

# Create necessary directories
echo "Creating directory structure..."
mkdir -p $PROJECT_DIR/{backend,frontend,nginx}
mkdir -p $PROJECT_DIR/backend/{app,tests,migrations}
mkdir -p $PROJECT_DIR/frontend/{public,src}

# Ensure correct permissions
echo "Setting permissions..."
chown -R ppelaez:ppelaez $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

# Pull latest changes
echo "Pulling latest changes..."
cd $PROJECT_DIR
git pull origin main

# Stop running containers
echo "Stopping running containers..."
docker-compose -f $COMPOSE_FILE down

# Build images
echo "Building containers..."
docker-compose -f $COMPOSE_FILE build --no-cache

# Start services
echo "Starting services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "Running database migrations..."
docker-compose -f $COMPOSE_FILE exec -T backend alembic upgrade head

# Verify deployment
echo "Verifying deployment..."
docker-compose -f $COMPOSE_FILE ps

# Check services health
echo "Checking services health..."
for service in backend frontend nginx db elasticsearch redis kibana; do
    if docker-compose -f $COMPOSE_FILE ps $service | grep -q "Up"; then
        echo "$service: OK"
    else
        echo "$service: FAILED"
        echo "Checking logs for $service..."
        docker-compose -f $COMPOSE_FILE logs $service
    fi
done

echo "Deployment complete!"
