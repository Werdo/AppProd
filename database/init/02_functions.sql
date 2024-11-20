-- database/init/02_functions.sql

-- Función para validar proceso previo
CREATE OR REPLACE FUNCTION production.validar_proceso_previo(
    p_dispositivo_id INTEGER,
    p_proceso_id INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_orden_actual INTEGER;
    v_proceso_previo_completado BOOLEAN;
BEGIN
    -- Obtener orden del proceso actual
    SELECT orden_secuencia INTO v_orden_actual
    FROM production.procesos
    WHERE id = p_proceso_id;
    
    -- Validar proceso previo
    IF v_orden_actual > 1 THEN
        SELECT EXISTS (
            SELECT 1
            FROM production.registro_procesos rp
            JOIN production.procesos pp ON pp.id = rp.proceso_id
            WHERE rp.dispositivo_id = p_dispositivo_id
            AND pp.orden_secuencia = v_orden_actual - 1
            AND rp.estado = 1
        ) INTO v_proceso_previo_completado;
        
        RETURN v_proceso_previo_completado;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para generar código de lote
CREATE OR REPLACE FUNCTION production.generar_codigo_lote(
    p_fecha DATE
) RETURNS TEXT AS $$
DECLARE
    v_numero_secuencial INTEGER;
    v_letra_control CHAR(1);
BEGIN
    -- Obtener último número secuencial del día
    SELECT COALESCE(MAX(numero_secuencial), 0) + 1
    INTO v_numero_secuencial
    FROM production.lotes_produccion
    WHERE fecha = p_fecha;
    
    -- Generar letra de control (A-Z)
    v_letra_control := CHR(65 + (v_numero_secuencial % 26));
    
    RETURN TO_CHAR(p_fecha, 'DDMMYY') || '-' ||
           LPAD(v_numero_secuencial::TEXT, 3, '0') ||
           v_letra_control;
END;
$$ LANGUAGE plpgsql;