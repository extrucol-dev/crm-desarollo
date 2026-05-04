-- ============================================================
-- CRM EXTRUCOL - ANALISIS VISTAS + PROCESOS
-- ============================================================

CREATE OR REPLACE VIEW VW_ANALISIS_SECTORES AS
SELECT
  c.sector,
  COUNT(DISTINCT o.id) AS oportunidades,
  COUNT(DISTINCT CASE WHEN o.estado = 'GANADA' THEN o.id END) AS ganadas,
  COUNT(DISTINCT CASE WHEN o.estado = 'PERDIDA' THEN o.id END) AS perdidas,
  ROUND(COUNT(DISTINCT CASE WHEN o.estado = 'GANADA' THEN o.id END) * 100.0 /
        NULLIF(COUNT(DISTINCT o.id),0), 1) AS tasa_exito,
  COALESCE(SUM(CASE WHEN o.estado = 'GANADA' THEN o.valor_estimado ELSE 0 END),0) AS valor_ganado
FROM crm_oportunidades o
JOIN crm_clientes c ON c.id = o.cliente_id
WHERE o.activo = 1
GROUP BY c.sector;

CREATE OR REPLACE VIEW VW_ANALISIS_FORECAST AS
SELECT
  TO_CHAR(o.fecha_cierre,'YYYY-MM') AS mes,
  COUNT(*) AS oportunidades,
  COALESCE(SUM(o.valor_estimado),0) AS valor_total,
  COUNT(CASE WHEN o.estado IN ('GANADA','NEGOCIACION','PROPUESTA') THEN 1 END) AS probabilidad_alta
FROM crm_oportunidades o
WHERE o.activo = 1 AND o.fecha_cierre IS NOT NULL AND o.estado NOT IN ('GANADA','PERDIDA')
GROUP BY TO_CHAR(o.fecha_cierre,'YYYY-MM')
ORDER BY mes;

-- ANALISIS_SECTORES
DECLARE l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR SELECT * FROM VW_ANALISIS_SECTORES;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;

-- ANALISIS_FORECAST
DECLARE l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR SELECT * FROM VW_ANALISIS_FORECAST;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;