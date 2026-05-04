-- =============================================================================
-- CRM EXTRUCOL — DROP ALL OBJECTS  (ejecutar antes de reinstalar)
-- Orden: tablas hija → tabla padre  (respeta FK constraints)
-- =============================================================================

-- ── Triggers ────────────────────────────────────────────────────────────────
BEGIN
  FOR t IN (SELECT trigger_name FROM user_triggers WHERE trigger_name LIKE 'TRG_CRM_%') LOOP
    EXECUTE IMMEDIATE 'DROP TRIGGER ' || t.trigger_name;
  END LOOP;
END;
/

-- ── Tablas (orden inverso de dependencia) ───────────────────────────────────
BEGIN
  FOR t IN (
    SELECT table_name FROM user_tables
    WHERE table_name IN (
      'CRM_AUDITORIA','CRM_NOTIFICACION','CRM_CUMPLIMIENTO_META',
      'CRM_META','CRM_PROYECTO_HITO','CRM_PROYECTO',
      'CRM_UBICACION','CRM_ACTIVIDAD',
      'CRM_HISTORIAL_ESTADO','CRM_OPORTUNIDAD_PRODUCTO','CRM_OPORTUNIDAD',
      'CRM_HISTORIAL_ESTADO_LEAD','CRM_LEAD_INTERES','CRM_LEAD',
      'CRM_TELEFONO','CRM_EMAIL','CRM_CONTACTO','CRM_EMPRESA',
      'CRM_USUARIO',
      'CRM_CONFIGURACION_SISTEMA',
      'CRM_MOTIVO_CIERRE','CRM_ESTADO_OPORTUNIDAD','CRM_TIPO_OPORTUNIDAD',
      'CRM_PRODUCTO','CRM_MOTIVO_DESCALIFICACION','CRM_INTERES',
      'CRM_ESTADO_LEAD','CRM_ORIGEN_LEAD',
      'CRM_SECTOR','CRM_MODALIDAD','CRM_DOCUMENTO',
      'CRM_MUNICIPIO','CRM_DEPARTAMENTO','CRM_PAIS'
    )
  ) LOOP
    BEGIN
      EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS PURGE';
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END LOOP;
END;
/

-- ── Secuencias ───────────────────────────────────────────────────────────────
BEGIN
  FOR s IN (
    SELECT sequence_name FROM user_sequences
    WHERE sequence_name LIKE 'CRM_%_SEQ'
  ) LOOP
    BEGIN
      EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END LOOP;
END;
/

