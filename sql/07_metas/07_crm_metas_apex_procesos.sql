-- ============================================================
-- CRM EXTRUCOL - APPLICATION PROCESSES para METAS
-- ============================================================

-- METAS_MIS_METAS
DECLARE l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT id, ejecutivo_id, periodo, tipo_meta, meta_valor, meta_alcanzada, estado, activo, fecha_creacion
      FROM crm_metas
     WHERE ejecutivo_id = 3 AND activo = 1
     ORDER BY periodo DESC;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;

-- METAS_CUMPLIMIENTO
DECLARE
  l_cur  SYS_REFCURSOR;
  l_per  VARCHAR2(7) := APEX_APPLICATION.G_X01;
  l_dato NUMBER(15,2);
BEGIN
  SELECT CASE WHEN SUM(m.meta_valor) = 0 THEN 0
         ELSE ROUND(SUM(m.meta_alcanzada) / SUM(m.meta_valor) * 100, 1) END
    INTO l_dato
    FROM crm_metas m
   WHERE m.periodo = l_per AND m.activo = 1;

  OPEN l_cur FOR
    SELECT m.id, u.nombre AS ejecutivo, m.periodo, m.tipo_meta, m.meta_valor, m.meta_alcanzada,
           ROUND(m.meta_alcanzada / NULLIF(m.meta_valor,0) * 100, 1) AS porcentaje,
           m.estado
      FROM crm_metas m JOIN crm_usuarios u ON u.id = m.ejecutivo_id
     WHERE m.periodo = l_per AND m.activo = 1
     ORDER BY porcentaje DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.WRITE('cumplimiento_promedio', l_dato);
  APEX_JSON.CLOSE_OBJECT;
END;