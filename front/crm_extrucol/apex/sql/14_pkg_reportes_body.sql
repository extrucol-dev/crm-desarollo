CREATE OR REPLACE PACKAGE BODY pkg_reportes AS

  PROCEDURE p_list(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT * FROM (
        SELECT 'PIPELINE' AS tipo, 'Pipeline de oportunidades' AS nombre, 'Oportunidades abiertas con valor y probabilidad' AS descripcion FROM DUAL
        UNION ALL
        SELECT 'VENTAS_MES', 'Ventas por mes', 'Oportunidades cerradas ganadas agrupadas por mes' FROM DUAL
        UNION ALL
        SELECT 'LEADS_ORIGEN', 'Leads por origen', 'Distribución de leads por canal de captación' FROM DUAL
        UNION ALL
        SELECT 'ACTIVIDADES', 'Actividades del equipo', 'Actividades realizadas en un rango de fechas' FROM DUAL
        UNION ALL
        SELECT 'CUMPLIMIENTO', 'Cumplimiento de metas', 'Porcentaje de cumplimiento de metas por ejecutivo' FROM DUAL
        UNION ALL
        SELECT 'SECTORES', 'Análisis por sector', 'Oportunidades y ventas agrupadas por sector de negocio' FROM DUAL
      ) ORDER BY nombre;
  END;

  PROCEDURE p_generar(p_tipo VARCHAR2, p_inicio VARCHAR2, p_fin VARCHAR2) IS
    l_ini DATE := NVL(TO_DATE(p_inicio, 'YYYY-MM-DD'), TRUNC(SYSDATE,'MM'));
    l_fin DATE := NVL(TO_DATE(p_fin,    'YYYY-MM-DD'), LAST_DAY(SYSDATE));
    l_cur SYS_REFCURSOR;
  BEGIN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('tipo', p_tipo);
    APEX_JSON.WRITE('fecha_inicio', TO_CHAR(l_ini, 'YYYY-MM-DD'));
    APEX_JSON.WRITE('fecha_fin', TO_CHAR(l_fin, 'YYYY-MM-DD'));

    IF p_tipo = 'PIPELINE' THEN
      OPEN l_cur FOR
        SELECT o.id_oportunidad, o.titulo, o.valor_estimado, o.probabilidad_cierre,
               o.fecha_cierre_estimada,
               eo.nombre AS estado, s.nombre AS sector,
               e.nombre AS empresa, u.nombre AS ejecutivo
          FROM crm_oportunidad o
          JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
          LEFT JOIN crm_sector s ON s.id_sector = o.id_sector
          LEFT JOIN crm_empresa e ON e.id_empresa = o.id_empresa
          JOIN crm_usuario u ON u.id_usuario = o.id_usuario
         WHERE eo.tipo = 'ABIERTO'
         ORDER BY o.valor_estimado DESC;

    ELSIF p_tipo = 'VENTAS_MES' THEN
      OPEN l_cur FOR
        SELECT TO_CHAR(o.fecha_actualizacion,'YYYY-MM') AS mes,
               COUNT(*) AS num_ventas,
               SUM(o.valor_final) AS total_ventas,
               u.nombre AS ejecutivo
          FROM crm_oportunidad o
          JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
          JOIN crm_usuario u ON u.id_usuario = o.id_usuario
         WHERE eo.tipo = 'GANADO'
           AND o.fecha_actualizacion BETWEEN l_ini AND l_fin
         GROUP BY TO_CHAR(o.fecha_actualizacion,'YYYY-MM'), u.nombre
         ORDER BY mes, u.nombre;

    ELSIF p_tipo = 'LEADS_ORIGEN' THEN
      OPEN l_cur FOR
        SELECT ol.nombre AS origen, ol.color_hex,
               COUNT(*) AS total_leads,
               COUNT(l.id_oportunidad_generada) AS convertidos,
               ROUND(COUNT(l.id_oportunidad_generada) / COUNT(*) * 100, 1) AS tasa_conversion
          FROM crm_lead l
          JOIN crm_origen_lead ol ON ol.id_origen_lead = l.id_origen_lead
         WHERE l.fecha_creacion BETWEEN l_ini AND l_fin
         GROUP BY ol.nombre, ol.color_hex
         ORDER BY total_leads DESC;

    ELSIF p_tipo = 'ACTIVIDADES' THEN
      OPEN l_cur FOR
        SELECT a.tipo,
               COUNT(*) AS total,
               COUNT(CASE WHEN a.resultado IS NOT NULL THEN 1 END) AS realizadas,
               COUNT(CASE WHEN a.virtual = 1 THEN 1 END) AS virtuales,
               u.nombre AS ejecutivo
          FROM crm_actividad a
          JOIN crm_usuario u ON u.id_usuario = a.id_usuario
         WHERE a.fecha_actividad BETWEEN l_ini AND l_fin
         GROUP BY a.tipo, u.nombre
         ORDER BY u.nombre, a.tipo;

    ELSIF p_tipo = 'CUMPLIMIENTO' THEN
      OPEN l_cur FOR
        SELECT u.nombre AS ejecutivo,
               m.nombre AS meta,
               m.metrica,
               c.valor_actual,
               c.valor_meta_snap AS valor_meta,
               c.pct_cumplimiento,
               c.mes,
               c.anio
          FROM crm_cumplimiento_meta c
          JOIN crm_usuario u ON u.id_usuario = c.id_usuario
          JOIN crm_meta m ON m.id_meta = c.id_meta
         WHERE c.mes = EXTRACT(MONTH FROM l_ini) AND c.anio = EXTRACT(YEAR FROM l_ini)
         ORDER BY u.nombre, m.metrica;

    ELSIF p_tipo = 'SECTORES' THEN
      OPEN l_cur FOR
        SELECT s.nombre AS sector, s.color_hex,
               COUNT(o.id_oportunidad) AS total_opps,
               SUM(o.valor_estimado) AS valor_pipeline,
               SUM(CASE WHEN eo.tipo='GANADO' THEN NVL(o.valor_final,0) END) AS ventas
          FROM crm_sector s
          LEFT JOIN crm_oportunidad o ON o.id_sector = s.id_sector AND o.fecha_creacion BETWEEN l_ini AND l_fin
          LEFT JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
         GROUP BY s.nombre, s.color_hex
         ORDER BY ventas DESC NULLS LAST;

    ELSE
      OPEN l_cur FOR SELECT 'tipo desconocido' AS error FROM DUAL;
    END IF;

    APEX_JSON.WRITE('data', l_cur);
    APEX_JSON.CLOSE_OBJECT;
  END;

END pkg_reportes;
/
PROMPT pkg_reportes body compiled.