#!/bin/bash
# setup_backend.sh

# Define base directory
BASE_DIR="/opt/production_system/AppProd/backend"

# Create directory structure
mkdir -p $BASE_DIR/{app,tests,migrations}
mkdir -p $BASE_DIR/app/{api,core,models,schemas,services}

# Create requirements.txt
cat > $BASE_DIR/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0
pydantic==2.4.2
alembic==1.12.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
aiofiles==23.2.1
jinja2==3.1.2
python-dateutil==2.8.2
elasticsearch==8.11.0
redis==5.0.1
httpx==0.25.2
pytest==7.4.3
pytest-asyncio==0.21.1
tenacity==8.2.3
weasyprint==60.1
reportlab==4.0.8
qrcode==7.4.2
python-barcode==0.15.1
fpdf2==2.7.6
EOF

# Create .env file
cat > $BASE_DIR/.env << 'EOF'
DATABASE_URL=postgresql://user:password@db:5432/production
SECRET_KEY=your-secret-key-here
ELASTICSEARCH_URL=http://elasticsearch:9200
REDIS_URL=redis://redis:6379/0
EOF

# Create main.py
mkdir -p $BASE_DIR/app
cat > $BASE_DIR/app/main.py << 'EOF'
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Production System API",
    description="Backend API for the Production System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
EOF

# Create __init__.py files
touch $BASE_DIR/app/__init__.py
touch $BASE_DIR/app/api/__init__.py
touch $BASE_DIR/app/core/__init__.py
touch $BASE_DIR/app/models/__init__.py
touch $BASE_DIR/app/schemas/__init__.py
touch $BASE_DIR/app/services/__init__.py

# Create Dockerfile
cat > $BASE_DIR/Dockerfile << 'EOF'
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
EOF

# Set permissions
chmod -R 755 $BASE_DIR
find $BASE_DIR -type f -exec chmod 644 {} \;
chmod +x $BASE_DIR/app/main.py

echo "Backend setup completed successfully!"

# Generate alembic.ini
cat > $BASE_DIR/alembic.ini << 'EOF'
[alembic]
script_location = migrations
sqlalchemy.url = driver://user:pass@localhost/dbname

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
EOF
