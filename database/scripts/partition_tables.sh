#!/bin/bash
# database/scripts/partition_tables.sh

# Crear particiones para tablas grandes
psql -U "$DB_USER" -d "$DB_NAME" <<EOF
-- Crear particiones por fecha para registro_procesos
CREATE TABLE production.registro_procesos_partitioned (
    id SERIAL,
    dispositivo_id INTEGER,
    proceso_id INTEGER,
    operario_id INTEGER,
    timestamp TIMESTAMP NOT NULL,
    estado INTEGER,
    notas TEXT
) PARTITION BY RANGE (timestamp);

-- Crear particiones mensuales
CREATE TABLE production.registro_procesos_y2024m01 
PARTITION OF production.registro_procesos_partitioned
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Función para crear particiones automáticamente
CREATE OR REPLACE FUNCTION production.create_partition_and_indexes()
RETURNS void AS $$
DECLARE
    partition_date DATE;
    partition_name TEXT;
BEGIN
    partition_date := date_trunc('month', NOW()) + interval '1 month';
    partition_name := 'registro_procesos_y' || 
                     to_char(partition_date, 'YYYY') ||
                     'm' || to_char(partition_date, 'MM');
    
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS production.%I 
         PARTITION OF production.registro_procesos_partitioned
         FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        partition_date,
        partition_date + interval '1 month'
    );
    
    -- Crear índices en la nueva partición
    EXECUTE format(
        'CREATE INDEX IF NOT EXISTS %I ON production.%I (dispositivo_id)',
        partition_name || '_dispositivo_idx',
        partition_name
    );
END;
$$ LANGUAGE plpgsql;
EOF