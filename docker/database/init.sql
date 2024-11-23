-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear schemas
CREATE SCHEMA IF NOT EXISTS production;
CREATE SCHEMA IF NOT EXISTS audit;

-- Configurar permisos
GRANT ALL ON SCHEMA production TO production_user;
GRANT ALL ON SCHEMA audit TO production_user;