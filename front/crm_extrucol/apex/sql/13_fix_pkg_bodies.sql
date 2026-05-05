-- =============================================================================
-- CRM EXTRUCOL — FIX: paquetes dañados (Oracle 11g)
-- Errores corregidos:
--   pkg_dashboard: FETCH FIRST n ROWS ONLY → subconsulta con ROWNUM
--   pkg_reportes:  l_inicio → l_ini
--   crm_session_api: paquete creado (faltante)
-- EJECUTAR CADA BLOQUE POR SEPARADO en SQL Workshop (Commands)
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- BLOQUE 1: CRM_SESSION_API  (ejecutar primero)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE crm_session_api AS
  FUNCTION get_usuario_id RETURN NUMBER;
END crm_session_api;
/

CREATE OR REPLACE PACKAGE BODY crm_session_api AS
  FUNCTION get_usuario_id RETURN NUMBER IS
    l_id NUMBER;
  BEGIN
    SELECT id_usuario INTO l_id
      FROM crm_usuario
     WHERE UPPER(email) = UPPER(v('APP_USER'))
       AND activo = 1;
    RETURN l_id;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN RETURN NULL;
  END;
END crm_session_api;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- BLOQUE 2: PKG_DASHBOARD body  (ejecutar después)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_dashboard AS

  PROCEDURE p_ejecutivo IS
    l_uid             NUMBER := crm_session_api.get_usuario_id;
    l_leads_activos   NUMBER;
    l_opps_abiertas   NUMBER;
    l_valor_pipeline  NUMBER;
    l_actis_hoy       NUMBER;
    l_tasa_conv       NUMBER;
    l_cur             SYS_REFCURSOR;
  BEGIN
    SELECT COUNT(*)
      INTO l_leads_activos
      FROM crm_lead l
      JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
     WHERE l.id_usuario = l_uid AND el.tipo IN ('ABIERTO','CALIFICADO');

    SELECT COUNT(*), NVL(SUM(o.valor_estimado), 0)
      INTO l_opps_abiertas, l_valor_pipeline
      FROM crm_oportunidad o
      JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
     WHERE o.id_usuario = l_uid AND eo.tipo = 'ABIERTO';

    SELECT COUNT(*)
      INTO l_actis_hoy
      FROM crm_actividad
     WHERE id_usuario = l_uid AND TRUNC(fecha_actividad) = TRUNC(SYSDATE);

    SELECT CASE WHEN total = 0 THEN 0
                ELSE ROUND(convertidos / total * 100, 1)
           END
      INTO l_tasa_conv
      FROM (
        SELECT COUNT(*) AS total,
               COUNT(id_oportunidad_generada) AS convertidos
          FROM crm_lead
         WHERE id_usuario = l_uid
           AND EXTRACT(MONTH FROM fecha_creacion) = EXTRACT(MONTH FROM SYSDATE)
           AND EXTRACT(YEAR  FROM fecha_creacion) = EXTRACT(YEAR  FROM SYSDATE)
      );

    APEX_JSON.OPEN_OBJECT;
      APEX_JSON.OPEN_OBJECT('kpis');
        APEX_JSON.WRITE('leads_activos',  l_leads_activos);
        APEX_JSON.WRITE('opps_abiertas',  l_opps_abiertas);
        APEX_JSON.WRITE('valor_pipeline', l_valor_pipeline);
        APEX_JSON.WRITE('actividades_hoy', l_actis_hoy);
        APEX_JSON.WRITE('tasa_conversion', l_tasa_conv);
      APEX_JSON.CLOSE_OBJECT;

      OPEN l_cur FOR
        SELECT * FROM (
          SELECT a.id_actividad, a.tipo, a.asunto, a.virtual,
                 a.fecha_actividad,
                 o.titulo AS oportunidad
            FROM crm_actividad a
            LEFT JOIN crm_oportunidad o ON o.id_oportunidad = a.id_oportunidad
           WHERE a.id_usuario = l_uid
             AND a.resultado  IS NULL
             AND a.fecha_actividad >= TRUNC(SYSDATE)
           ORDER BY a.fecha_actividad
        ) WHERE ROWNUM <= 5;
      APEX_JSON.WRITE('actividades_proximas', l_cur);

      OPEN l_cur FOR
        SELECT * FROM (
          SELECT o.id_oportunidad, o.titulo, o.valor_estimado,
                 o.probabilidad_cierre, o.fecha_cierre_estimada,
                 eo.nombre AS estado, eo.color_hex,
                 e.nombre  AS empresa
            FROM crm_oportunidad o
            JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
            LEFT JOIN crm_empresa e        ON e.id_empresa = o.id_empresa
           WHERE o.id_usuario = l_uid AND eo.tipo = 'ABIERTO'
           ORDER BY o.valor_estimado DESC NULLS LAST
        ) WHERE ROWNUM <= 10;
      APEX_JSON.WRITE('oportunidades', l_cur);

      OPEN l_cur FOR
        SELECT * FROM (
          SELECT l.id_lead, l.titulo, l.score, l.nombre_empresa,
                 l.fecha_actualizacion,
                 el.nombre AS estado, el.color_hex
            FROM crm_lead l
            JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
           WHERE l.id_usuario = l_uid AND el.tipo != 'DESCALIFICADO'
           ORDER BY l.fecha_actualizacion DESC
        ) WHERE ROWNUM <= 5;
      APEX_JSON.WRITE('leads_recientes', l_cur);

    APEX_JSON.CLOSE_OBJECT;
  END;

  PROCEDURE p_coordinador IS
    l_uid             NUMBER := crm_session_api.get_usuario_id;
    l_leads_sin_cto   NUMBER;
    l_opps_estancadas NUMBER;
    l_alertas_crit    NUMBER;
    l_actis_hoy       NUMBER;
    l_cur             SYS_REFCURSOR;
  BEGIN
    SELECT COUNT(*)
      INTO l_leads_sin_cto
      FROM crm_lead l
      JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
     WHERE el.nombre = 'Nuevo'
       AND SYSDATE - l.fecha_creacion > (
             SELECT TO_NUMBER(valor) FROM crm_configuracion_sistema
              WHERE clave = 'dias_alerta_lead_sin_contactar'
           );

    SELECT COUNT(*)
      INTO l_opps_estancadas
      FROM crm_oportunidad o
      JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
     WHERE eo.tipo = 'ABIERTO'
       AND SYSDATE - o.fecha_actualizacion > (
             SELECT TO_NUMBER(valor) FROM crm_configuracion_sistema
              WHERE clave = 'dias_alerta_opp_estancada'
           );

    SELECT COUNT(*)
      INTO l_alertas_crit
      FROM crm_notificacion
     WHERE tipo = 'CRITICA' AND leida = 0;

    SELECT COUNT(*)
      INTO l_actis_hoy
      FROM crm_actividad
     WHERE TRUNC(fecha_actividad) = TRUNC(SYSDATE);

    APEX_JSON.OPEN_OBJECT;
      APEX_JSON.OPEN_OBJECT('kpis');
        APEX_JSON.WRITE('leads_sin_contactar', l_leads_sin_cto);
        APEX_JSON.WRITE('opps_estancadas',     l_opps_estancadas);
        APEX_JSON.WRITE('alertas_criticas',    l_alertas_crit);
        APEX_JSON.WRITE('actividades_hoy',     l_actis_hoy);
      APEX_JSON.CLOSE_OBJECT;

      OPEN l_cur FOR
        SELECT u.id_usuario, u.nombre AS ejecutivo,
               COUNT(DISTINCT l.id_lead)        AS leads_mes,
               COUNT(DISTINCT o.id_oportunidad) AS opps_abiertas,
               COUNT(DISTINCT a.id_actividad)   AS actividades_mes,
               NVL(SUM(CASE WHEN eo.tipo='ABIERTO' THEN o.valor_estimado END), 0) AS valor_pipeline
          FROM crm_usuario u
          LEFT JOIN crm_lead l ON l.id_usuario = u.id_usuario
                              AND EXTRACT(MONTH FROM l.fecha_creacion) = EXTRACT(MONTH FROM SYSDATE)
                              AND EXTRACT(YEAR  FROM l.fecha_creacion) = EXTRACT(YEAR  FROM SYSDATE)
          LEFT JOIN crm_oportunidad o ON o.id_usuario = u.id_usuario
          LEFT JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
          LEFT JOIN crm_actividad a ON a.id_usuario = u.id_usuario
                                  AND EXTRACT(MONTH FROM a.fecha_actividad) = EXTRACT(MONTH FROM SYSDATE)
                                  AND EXTRACT(YEAR  FROM a.fecha_actividad) = EXTRACT(YEAR  FROM SYSDATE)
         WHERE u.rol = 'EJECUTIVO' AND u.activo = 1
         GROUP BY u.id_usuario, u.nombre
         ORDER BY valor_pipeline DESC;
      APEX_JSON.WRITE('equipo', l_cur);

      OPEN l_cur FOR
        SELECT * FROM (
          SELECT n.id_notificacion, n.tipo, n.titulo, n.mensaje,
                 n.fecha_creacion,
                 u.nombre AS ejecutivo
            FROM crm_notificacion n
            LEFT JOIN crm_usuario u ON u.id_usuario = n.id_usuario_destino
           WHERE n.leida = 0
           ORDER BY DECODE(n.tipo,'CRITICA',1,'ADVERTENCIA',2,'INFO',3,'EXITO',4), n.fecha_creacion DESC
        ) WHERE ROWNUM <= 10;
      APEX_JSON.WRITE('alertas', l_cur);

    APEX_JSON.CLOSE_OBJECT;
  END;

END pkg_dashboard;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- BLOQUE 3: PKG_REPORTES body  (ejecutar al final)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_reportes AS

  PROCEDURE p_list(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT 'PIPELINE'       AS tipo, 'Pipeline de oportunidades'      AS nombre,
             'Oportunidades abiertas con valor y probabilidad'          AS descripcion FROM DUAL
      UNION ALL
      SELECT 'VENTAS_MES',    'Ventas por mes',
             'Oportunidades cerradas ganadas agrupadas por mes'         FROM DUAL
      UNION ALL
      SELECT 'LEADS_ORIGEN',  'Leads por origen',
             'Distribución de leads por canal de captación'             FROM DUAL
      UNION ALL
      SELECT 'ACTIVIDADES',   'Actividades del equipo',
             'Actividades realizadas en un rango de fechas'             FROM DUAL
      UNION ALL
      SELECT 'CUMPLIMIENTO',  'Cumplimiento de metas',
             'Porcentaje de cumplimiento de metas por ejecutivo'       FROM DUAL
      UNION ALL
      SELECT 'SECTORES',      'Análisis por sector',
             'Oportunidades y ventas agrupadas por sector de negocio'   FROM DUAL
      ORDER BY nombre;
  END;

  PROCEDURE p_generar(p_tipo VARCHAR2, p_inicio VARCHAR2, p_fin VARCHAR2) IS
    l_ini DATE := NVL(TO_DATE(p_inicio, 'YYYY-MM-DD'), TRUNC(SYSDATE,'MM'));
    l_fin DATE := NVL(TO_DATE(p_fin,    'YYYY-MM-DD'), LAST_DAY(SYSDATE));
    l_cur SYS_REFCURSOR;
  BEGIN
    APEX_JSON.OPEN_OBJECT;
      APEX_JSON.WRITE('tipo',         p_tipo);
      APEX_JSON.WRITE('fecha_inicio', TO_CHAR(l_ini, 'YYYY-MM-DD'));
      APEX_JSON.WRITE('fecha_fin',    TO_CHAR(l_fin, 'YYYY-MM-DD'));

      CASE p_tipo
        WHEN 'PIPELINE' THEN
          OPEN l_cur FOR
            SELECT o.id_oportunidad, o.titulo, o.valor_estimado, o.probabilidad_cierre,
                   o.fecha_cierre_estimada,
                   eo.nombre AS estado, s.nombre AS sector,
                   e.nombre  AS empresa, u.nombre AS ejecutivo
              FROM crm_oportunidad o
              JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
              LEFT JOIN crm_sector s ON s.id_sector = o.id_sector
              LEFT JOIN crm_empresa e ON e.id_empresa = o.id_empresa
              JOIN crm_usuario u ON u.id_usuario = o.id_usuario
             WHERE eo.tipo = 'ABIERTO'
             ORDER BY o.valor_estimado DESC;

        WHEN 'VENTAS_MES' THEN
          OPEN l_cur FOR
            SELECT TO_CHAR(o.fecha_actualizacion,'YYYY-MM') AS mes,
                   COUNT(*)                    AS num_ventas,
                   SUM(o.valor_final)          AS total_ventas,
                   u.nombre                    AS ejecutivo
              FROM crm_oportunidad o
              JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
              JOIN crm_usuario u ON u.id_usuario = o.id_usuario
             WHERE eo.tipo = 'GANADO'
               AND o.fecha_actualizacion BETWEEN l_ini AND l_fin
             GROUP BY TO_CHAR(o.fecha_actualizacion,'YYYY-MM'), u.nombre
             ORDER BY mes, u.nombre;

        WHEN 'LEADS_ORIGEN' THEN
          OPEN l_cur FOR
            SELECT ol.nombre AS origen, ol.color_hex,
                   COUNT(*)  AS total_leads,
                   COUNT(l.id_oportunidad_generada) AS convertidos,
                   ROUND(COUNT(l.id_oportunidad_generada) / COUNT(*) * 100, 1) AS tasa_conversion
              FROM crm_lead l
              JOIN crm_origen_lead ol ON ol.id_origen_lead = l.id_origen_lead
             WHERE l.fecha_creacion BETWEEN l_ini AND l_fin
             GROUP BY ol.nombre, ol.color_hex
             ORDER BY total_leads DESC;

        WHEN 'ACTIVIDADES' THEN
          OPEN l_cur FOR
            SELECT a.tipo,
                   COUNT(*)  AS total,
                   COUNT(CASE WHEN a.resultado IS NOT NULL THEN 1 END) AS realizadas,
                   COUNT(CASE WHEN a.virtual = 1 THEN 1 END) AS virtuales,
                   u.nombre  AS ejecutivo
              FROM crm_actividad a
              JOIN crm_usuario u ON u.id_usuario = a.id_usuario
             WHERE a.fecha_actividad BETWEEN l_ini AND l_fin
             GROUP BY a.tipo, u.nombre
             ORDER BY u.nombre, a.tipo;

        WHEN 'CUMPLIMIENTO' THEN
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
              JOIN crm_meta m    ON m.id_meta    = c.id_meta
             WHERE (c.mes  = EXTRACT(MONTH FROM l_ini) AND c.anio = EXTRACT(YEAR FROM l_ini))
                OR (l_ini IS NULL)
             ORDER BY u.nombre, m.metrica;

        WHEN 'SECTORES' THEN
          OPEN l_cur FOR
            SELECT s.nombre AS sector, s.color_hex,
                   COUNT(o.id_oportunidad)       AS total_opps,
                   SUM(o.valor_estimado)          AS valor_pipeline,
                   SUM(CASE WHEN eo.tipo='GANADO' THEN NVL(o.valor_final,0) END) AS ventas
              FROM crm_sector s
              LEFT JOIN crm_oportunidad o ON o.id_sector = s.id_sector
                                         AND o.fecha_creacion BETWEEN l_ini AND l_fin
              LEFT JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
             GROUP BY s.nombre, s.color_hex
             ORDER BY ventas DESC NULLS LAST;

        ELSE
          OPEN l_cur FOR SELECT 'tipo desconocido' AS error FROM DUAL;
      END CASE;

      APEX_JSON.WRITE('data', l_cur);
    APEX_JSON.CLOSE_OBJECT;
  END;

END pkg_reportes;
/

PROMPT Listo: crm_session_api + pkg_dashboard + pkg_reportes recompilados.