-- database/init/03_triggers.sql

-- Trigger para actualizar timestamps
CREATE OR REPLACE FUNCTION production.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas relevantes
CREATE TRIGGER update_operarios_timestamp
    BEFORE UPDATE ON production.operarios
    FOR EACH ROW
    EXECUTE FUNCTION production.update_timestamp();

-- Trigger para auditoría de dispositivos
CREATE OR REPLACE FUNCTION audit.log_cambios_dispositivos()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit.cambios_dispositivos(
            dispositivo_id,
            campo_modificado,
            valor_anterior,
            valor_nuevo,
            usuario
        )
        SELECT
            NEW.id,
            key,
            old_value,
            new_value,
            current_user
        FROM (
            SELECT *
            FROM jsonb_each_text(to_jsonb(OLD)) old_fields
            FULL OUTER JOIN jsonb_each_text(to_jsonb(NEW)) new_fields
            USING (key)
            WHERE old_fields.value IS DISTINCT FROM new_fields.value
        ) changes;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_dispositivos
    AFTER UPDATE ON production.dispositivos
    FOR EACH ROW
    EXECUTE FUNCTION audit.log_cambios_dispositivos();