-- ============================================================
-- CRM EXTRUCOL - DASHBOARD DDL + VISTAS
-- ============================================================

-- KPIS por rol
CREATE OR REPLACE VIEW VW_DASHBOARD_EJECUTIVO AS
SELECT
  u.id AS usuario_id, u.nombre,
  (SELECT COUNT(*) FROM crm_oportunidades o WHERE o.ejecutivo_id = u.id AND o.estado NOT IN ('GANADA','PERDIDA') AND o.activo = 1) AS oportunidades_activas,
  (SELECT COUNT(*) FROM crm_oportunidades o WHERE o.ejecutivo_id = u.id AND o.estado = 'GANADA' AND o.activo = 1) AS oportunidades_ganadas,
  (SELECT COALESCE(SUM(o.valor_estimado),0) FROM crm_oportunidades o WHERE o.ejecutivo_id = u.id AND o.estado = 'GANADA' AND o.activo = 1) AS valor_ganado,
  (SELECT COUNT(*) FROM crm_actividades a WHERE a.ejecutivo_id = u.id AND a.activo = 1 AND TRUNC(a.fecha_actividad) = TRUNC(SYSDATE)) AS actividades_hoy,
  (SELECT COUNT(*) FROM crm_leads l WHERE l.ejecutivo_id = u.id AND l.estado = 'NUEVO' AND l.activo = 1) AS leads_nuevos
FROM crm_usuarios u WHERE u.rol = 'EJECUTIVO';

CREATE OR REPLACE VIEW VW_DASHBOARD_COORDINADOR AS
SELECT
  u.id AS usuario_id, u.nombre,
  (SELECT COUNT(*) FROM crm_oportunidades o WHERE o.ejecutivo_id = u.id AND o.estado NOT IN ('GANADA','PERDIDA') AND o.activo = 1) AS oportunidades_activas,
  (SELECT COUNT(*) FROM crm_oportunidades o WHERE o.ejecutivo_id = u.id AND o.estado = 'GANADA' AND o.activo = 1) AS ganadas_mes,
  (SELECT COALESCE(SUM(o.valor_estimado),0) FROM crm_oportunidades o WHERE o.ejecutivo_id = u.id AND o.estado = 'GANADA' AND o.activo = 1) AS valor_ganado,
  (SELECT COUNT(*) FROM crm_actividades a WHERE a.ejecutivo_id = u.id AND a.activo = 1 AND a.fecha_actividad >= TRUNC(SYSDATE,'MM')) AS actividades_mes
FROM crm_usuarios u WHERE u.rol = 'EJECUTIVO';

-- Pipeline resumido global
CREATE OR REPLACE VIEW VW_PIPELINE_RESUMEN AS
SELECT
  estado, COUNT(*) AS cantidad, COALESCE(SUM(valor_estimado),0) AS valor
FROM crm_oportunidades WHERE activo = 1 AND estado NOT IN ('GANADA','PERDIDA')
GROUP BY estado;

-- ============================================================
-- APPLICATION PROCESSES para DASHBOARD
-- ============================================================

-- DASHBOARD_EJECUTIVO
DECLARE l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR SELECT * FROM VW_DASHBOARD_EJECUTIVO WHERE usuario_id = 3;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;

-- DASHBOARD_COORDINADOR
DECLARE l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR SELECT * FROM VW_DASHBOARD_COORDINADOR;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;