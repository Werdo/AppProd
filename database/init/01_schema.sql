-- database/init/01_schema.sql

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Esquemas
CREATE SCHEMA IF NOT EXISTS production;
CREATE SCHEMA IF NOT EXISTS audit;

-- Tabla de Operarios
CREATE TABLE production.operarios (
    id SERIAL PRIMARY KEY,
    codigo_qr VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Versiones de Producto
CREATE TABLE production.versiones_producto (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(4) NOT NULL UNIQUE,
    descripcion VARCHAR(100),
    es_oem BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Órdenes de Producción
CREATE TABLE production.ordenes_produccion (
    id SERIAL PRIMARY KEY,
    numero_orden VARCHAR(50) UNIQUE NOT NULL,
    version_producto_id INTEGER REFERENCES production.versiones_producto(id),
    fecha_inicio DATE NOT NULL,
    cantidad_total INTEGER NOT NULL,
    cantidad_producida INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    cliente VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Tabla de Lotes de Producción
CREATE TABLE production.lotes_produccion (
    id SERIAL PRIMARY KEY,
    codigo_lote VARCHAR(20) NOT NULL UNIQUE,
    orden_produccion_id INTEGER REFERENCES production.ordenes_produccion(id),
    fecha DATE NOT NULL,
    numero_secuencial INTEGER NOT NULL,
    letra_control CHAR(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_lote_fecha_seq UNIQUE(fecha, numero_secuencial)
);

-- Tabla de Dispositivos
CREATE TABLE production.dispositivos (
    id SERIAL PRIMARY KEY,
    imei VARCHAR(15) NOT NULL UNIQUE,
    iccid VARCHAR(20) NOT NULL UNIQUE,
    orden_produccion_id INTEGER REFERENCES production.ordenes_produccion(id),
    lote_id INTEGER REFERENCES production.lotes_produccion(id),
    operario_id INTEGER REFERENCES production.operarios(id),
    version_producto_id INTEGER REFERENCES production.versiones_producto(id),
    es_oem BOOLEAN DEFAULT false,
    control_activo BOOLEAN DEFAULT true,
    bloqueado BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Procesos de Producción
CREATE TABLE production.procesos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    orden_secuencia INTEGER NOT NULL,
    requiere_validacion_previa BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Registro de Procesos
CREATE TABLE production.registro_procesos (
    id SERIAL PRIMARY KEY,
    dispositivo_id INTEGER REFERENCES production.dispositivos(id),
    proceso_id INTEGER REFERENCES production.procesos(id),
    operario_id INTEGER REFERENCES production.operarios(id),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado INTEGER DEFAULT 1,
    notas TEXT,
    UNIQUE(dispositivo_id, proceso_id)
);

-- Tabla de Cajas Expositoras
CREATE TABLE production.cajas_expositoras (
    id SERIAL PRIMARY KEY,
    codigo_caja VARCHAR(50) UNIQUE NOT NULL,
    orden_produccion_id INTEGER REFERENCES production.ordenes_produccion(id),
    lote_id INTEGER REFERENCES production.lotes_produccion(id),
    operario_id INTEGER REFERENCES production.operarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'EN_PROCESO',
    cantidad_dispositivos INTEGER DEFAULT 0 CHECK (cantidad_dispositivos <= 24)
);

-- Tabla de Dispositivos en Cajas Expositoras
CREATE TABLE production.dispositivos_caja_expositora (
    id SERIAL PRIMARY KEY,
    caja_expositora_id INTEGER REFERENCES production.cajas_expositoras(id),
    dispositivo_id INTEGER REFERENCES production.dispositivos(id),
    posicion INTEGER CHECK (posicion >= 1 AND posicion <= 24),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(caja_expositora_id, dispositivo_id),
    UNIQUE(caja_expositora_id, posicion)
);

-- Tabla de Cajas Master
CREATE TABLE production.cajas_master (
    id SERIAL PRIMARY KEY,
    codigo_caja VARCHAR(50) UNIQUE NOT NULL,
    orden_produccion_id INTEGER REFERENCES production.ordenes_produccion(id),
    lote_id INTEGER REFERENCES production.lotes_produccion(id),
    operario_id INTEGER REFERENCES production.operarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'EN_PROCESO',
    cantidad_expositoras INTEGER DEFAULT 0 CHECK (cantidad_expositoras <= 4)
);

-- Tabla de Expositoras en Cajas Master
CREATE TABLE production.expositoras_caja_master (
    id SERIAL PRIMARY KEY,
    caja_master_id INTEGER REFERENCES production.cajas_master(id),
    caja_expositora_id INTEGER REFERENCES production.cajas_expositoras(id),
    posicion INTEGER CHECK (posicion >= 1 AND posicion <= 4),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(caja_master_id, caja_expositora_id),
    UNIQUE(caja_master_id, posicion)
);

-- Tablas de Auditoría
CREATE TABLE audit.cambios_dispositivos (
    id SERIAL PRIMARY KEY,
    dispositivo_id INTEGER NOT NULL,
    campo_modificado VARCHAR(50) NOT NULL,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario VARCHAR(50) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_dispositivos_imei ON production.dispositivos(imei);
CREATE INDEX idx_dispositivos_iccid ON production.dispositivos(iccid);
CREATE INDEX idx_dispositivos_orden ON production.dispositivos(orden_produccion_id);
CREATE INDEX idx_registro_procesos_timestamp ON production.registro_procesos(timestamp);
CREATE INDEX idx_cajas_expositoras_codigo ON production.cajas_expositoras(codigo_caja);
CREATE INDEX idx_cajas_master_codigo ON production.cajas_master(codigo_caja);