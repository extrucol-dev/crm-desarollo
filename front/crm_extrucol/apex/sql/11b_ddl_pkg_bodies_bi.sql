-- =============================================================================
-- CRM EXTRUCOL — BODIES: capa BI / análisis
-- pkg_dashboard, pkg_metas, pkg_alertas, pkg_equipo,
-- pkg_monitoreo, pkg_analisis, pkg_reportes
-- Ejecutar DESPUÉS de 11a_ddl_pkg_bodies_data.sql
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_DASHBOARD
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
    -- KPIs
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

    -- Tasa conversión lead → opp este mes
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
      -- KPIs
      APEX_JSON.OPEN_OBJECT('kpis');
        APEX_JSON.WRITE('leads_activos',  l_leads_activos);
        APEX_JSON.WRITE('opps_abiertas',  l_opps_abiertas);
        APEX_JSON.WRITE('valor_pipeline', l_valor_pipeline);
        APEX_JSON.WRITE('actividades_hoy', l_actis_hoy);
        APEX_JSON.WRITE('tasa_conversion', l_tasa_conv);
      APEX_JSON.CLOSE_OBJECT;

      -- Próximas actividades (5)
      OPEN l_cur FOR
        SELECT a.id_actividad, a.tipo, a.asunto, a.virtual,
               a.fecha_actividad,
               o.titulo AS oportunidad
          FROM crm_actividad a
          LEFT JOIN crm_oportunidad o ON o.id_oportunidad = a.id_oportunidad
         WHERE a.id_usuario = l_uid
           AND a.resultado  IS NULL
           AND a.fecha_actividad >= TRUNC(SYSDATE)
         ORDER BY a.fecha_actividad
         FETCH FIRST 5 ROWS ONLY;
      APEX_JSON.WRITE('actividades_proximas', l_cur);

      -- Pipeline de oportunidades abiertas (10 más valiosas)
      OPEN l_cur FOR
        SELECT o.id_oportunidad, o.titulo, o.valor_estimado,
               o.probabilidad_cierre, o.fecha_cierre_estimada,
               eo.nombre AS estado, eo.color_hex,
               e.nombre  AS empresa
          FROM crm_oportunidad o
          JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
          LEFT JOIN crm_empresa e        ON e.id_empresa = o.id_empresa
         WHERE o.id_usuario = l_uid AND eo.tipo = 'ABIERTO'
         ORDER BY o.valor_estimado DESC NULLS LAST
         FETCH FIRST 10 ROWS ONLY;
      APEX_JSON.WRITE('oportunidades', l_cur);

      -- Leads recientes (5)
      OPEN l_cur FOR
        SELECT l.id_lead, l.titulo, l.score, l.nombre_empresa,
               l.fecha_actualizacion,
               el.nombre AS estado, el.color_hex
          FROM crm_lead l
          JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
         WHERE l.id_usuario = l_uid AND el.tipo != 'DESCALIFICADO'
         ORDER BY l.fecha_actualizacion DESC
         FETCH FIRST 5 ROWS ONLY;
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
    -- KPIs del coordinador: vista del equipo completo
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

      -- Rendimiento del equipo este mes
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

      -- Alertas activas (no leídas)
      OPEN l_cur FOR
        SELECT n.id_notificacion, n.tipo, n.titulo, n.mensaje,
               n.fecha_creacion,
               u.nombre AS ejecutivo
          FROM crm_notificacion n
          LEFT JOIN crm_usuario u ON u.id_usuario = n.id_usuario_destino
         WHERE n.leida = 0
         ORDER BY DECODE(n.tipo,'CRITICA',1,'ADVERTENCIA',2,'INFO',3,'EXITO',4), n.fecha_creacion DESC
         FETCH FIRST 10 ROWS ONLY;
      APEX_JSON.WRITE('alertas', l_cur);

    APEX_JSON.CLOSE_OBJECT;
  END;

END pkg_dashboard;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_METAS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_metas AS

  PROCEDURE p_mis_metas(p_cur OUT SYS_REFCURSOR) IS
    l_uid  NUMBER := crm_session_api.get_usuario_id;
    l_mes  NUMBER := EXTRACT(MONTH FROM SYSDATE);
    l_anio NUMBER := EXTRACT(YEAR  FROM SYSDATE);
  BEGIN
    OPEN p_cur FOR
      SELECT m.id_meta,
             m.nombre,
             m.descripcion,
             m.metrica,
             m.valor_meta,
             m.unidad,
             m.periodo,
             NVL(c.valor_actual,     0) AS valor_actual,
             NVL(c.pct_cumplimiento, 0) AS pct_cumplimiento,
             c.fecha_calculo
        FROM crm_meta m
        LEFT JOIN crm_cumplimiento_meta c
             ON  c.id_meta   = m.id_meta
             AND c.id_usuario = l_uid
             AND c.mes  = l_mes
             AND c.anio = l_anio
       WHERE m.activo = 1
         AND (m.id_usuario = l_uid OR m.id_usuario IS NULL)
       ORDER BY m.metrica;
  END;

  PROCEDURE p_cumplimiento(p_mes NUMBER, p_anio NUMBER, p_cur OUT SYS_REFCURSOR) IS
    l_mes  NUMBER := NVL(p_mes,  EXTRACT(MONTH FROM SYSDATE));
    l_anio NUMBER := NVL(p_anio, EXTRACT(YEAR  FROM SYSDATE));
  BEGIN
    OPEN p_cur FOR
      SELECT u.id_usuario,
             u.nombre  AS ejecutivo,
             m.id_meta,
             m.nombre  AS meta,
             m.metrica,
             m.valor_meta,
             m.unidad,
             NVL(c.valor_actual,     0) AS valor_actual,
             NVL(c.pct_cumplimiento, 0) AS pct_cumplimiento,
             c.fecha_calculo
        FROM crm_usuario u
        JOIN crm_meta m ON m.id_usuario = u.id_usuario OR m.id_usuario IS NULL
        LEFT JOIN crm_cumplimiento_meta c
             ON  c.id_meta    = m.id_meta
             AND c.id_usuario = u.id_usuario
             AND c.mes  = l_mes
             AND c.anio = l_anio
       WHERE u.rol = 'EJECUTIVO' AND u.activo = 1 AND m.activo = 1
       ORDER BY u.nombre, m.metrica;
  END;

END pkg_metas;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_ALERTAS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_alertas AS

  PROCEDURE p_list(p_cur OUT SYS_REFCURSOR) IS
    l_uid NUMBER := crm_session_api.get_usuario_id;
  BEGIN
    OPEN p_cur FOR
      SELECT n.id_notificacion,
             n.tipo,
             n.titulo,
             n.mensaje,
             n.canal,
             n.leida,
             n.fecha_creacion,
             n.id_lead,
             n.id_oportunidad,
             uo.nombre AS origen_nombre
        FROM crm_notificacion n
        LEFT JOIN crm_usuario uo ON uo.id_usuario = n.id_usuario_origen
       WHERE n.id_usuario_destino = l_uid
         AND n.leida = 0
       ORDER BY DECODE(n.tipo,'CRITICA',1,'ADVERTENCIA',2,'INFO',3,'EXITO',4),
                n.fecha_creacion DESC;
  END;

  PROCEDURE p_log(p_inicio VARCHAR2, p_fin VARCHAR2, p_cur OUT SYS_REFCURSOR) IS
    l_uid NUMBER := crm_session_api.get_usuario_id;
    l_ini DATE   := NVL(TO_DATE(p_inicio, 'YYYY-MM-DD'), TRUNC(SYSDATE) - 30);
    l_fin DATE   := NVL(TO_DATE(p_fin,    'YYYY-MM-DD'), SYSDATE);
  BEGIN
    OPEN p_cur FOR
      SELECT n.id_notificacion,
             n.tipo,
             n.titulo,
             n.mensaje,
             n.canal,
             n.leida,
             n.fecha_creacion,
             n.fecha_lectura,
             n.id_lead,
             n.id_oportunidad
        FROM crm_notificacion n
       WHERE n.id_usuario_destino = l_uid
         AND n.fecha_creacion BETWEEN l_ini AND l_fin
       ORDER BY n.fecha_creacion DESC;
  END;

  PROCEDURE p_marcar_leida(p_id NUMBER) IS
    l_uid NUMBER := crm_session_api.get_usuario_id;
  BEGIN
    UPDATE crm_notificacion
       SET leida        = 1,
           fecha_lectura = SYSDATE
     WHERE id_notificacion    = p_id
       AND id_usuario_destino = l_uid;
    COMMIT;
  END;

END pkg_alertas;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_EQUIPO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_equipo AS

  PROCEDURE p_list(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT u.id_usuario,
             u.nombre,
             u.email,
             u.rol,
             u.activo,
             u.ultimo_acceso,
             d.nombre AS departamento,
             (SELECT COUNT(*) FROM crm_lead l
               WHERE l.id_usuario = u.id_usuario
                 AND EXTRACT(MONTH FROM l.fecha_creacion) = EXTRACT(MONTH FROM SYSDATE)
                 AND EXTRACT(YEAR  FROM l.fecha_creacion) = EXTRACT(YEAR  FROM SYSDATE))
                       AS leads_mes,
             (SELECT COUNT(*) FROM crm_oportunidad o
               JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
              WHERE o.id_usuario = u.id_usuario AND eo.tipo = 'ABIERTO')
                       AS opps_abiertas,
             (SELECT COUNT(*) FROM crm_actividad a
               WHERE a.id_usuario = u.id_usuario
                 AND EXTRACT(MONTH FROM a.fecha_actividad) = EXTRACT(MONTH FROM SYSDATE)
                 AND EXTRACT(YEAR  FROM a.fecha_actividad) = EXTRACT(YEAR  FROM SYSDATE))
                       AS actividades_mes
        FROM crm_usuario u
        LEFT JOIN crm_departamento d ON d.id_departamento = u.id_departamento
       WHERE u.rol = 'EJECUTIVO' AND u.activo = 1
       ORDER BY u.nombre;
  END;

  PROCEDURE p_get_ejecutivo(p_id NUMBER, p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT u.id_usuario,
             u.nombre,
             u.email,
             u.rol,
             u.activo,
             u.fecha_creacion,
             u.ultimo_acceso,
             d.nombre AS departamento,
             -- Totales históricos
             (SELECT COUNT(*) FROM crm_lead        l WHERE l.id_usuario = u.id_usuario) AS total_leads,
             (SELECT COUNT(*) FROM crm_oportunidad o WHERE o.id_usuario = u.id_usuario) AS total_opps,
             (SELECT COUNT(*) FROM crm_oportunidad o
               JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
              WHERE o.id_usuario = u.id_usuario AND eo.tipo = 'GANADO')                 AS opps_ganadas,
             (SELECT NVL(SUM(o.valor_final),0) FROM crm_oportunidad o
               JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
              WHERE o.id_usuario = u.id_usuario AND eo.tipo = 'GANADO')                 AS ventas_historico,
             -- Mes actual
             (SELECT COUNT(*) FROM crm_actividad a
               WHERE a.id_usuario = u.id_usuario
                 AND EXTRACT(MONTH FROM a.fecha_actividad) = EXTRACT(MONTH FROM SYSDATE)
                 AND EXTRACT(YEAR  FROM a.fecha_actividad) = EXTRACT(YEAR  FROM SYSDATE))
                                                                                         AS actividades_mes,
             -- Pipeline actual
             (SELECT NVL(SUM(o.valor_estimado),0) FROM crm_oportunidad o
               JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
              WHERE o.id_usuario = u.id_usuario AND eo.tipo = 'ABIERTO')                AS valor_pipeline
        FROM crm_usuario u
        LEFT JOIN crm_departamento d ON d.id_departamento = u.id_departamento
       WHERE u.id_usuario = p_id;
  END;

END pkg_equipo;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_MONITOREO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_monitoreo AS

  PROCEDURE p_ejecutivos_gps(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    -- Última ubicación registrada por ejecutivo (actividad presencial más reciente)
    OPEN p_cur FOR
      SELECT u.id_usuario,
             u.nombre AS ejecutivo,
             ub.latitud,
             ub.longitud,
             ub.direccion,
             a.fecha_actividad AS ultima_actividad,
             a.asunto,
             o.titulo AS oportunidad
        FROM crm_usuario u
        JOIN crm_actividad a ON a.id_usuario = u.id_usuario
        JOIN crm_ubicacion ub ON ub.id_actividad = a.id_actividad
        LEFT JOIN crm_oportunidad o ON o.id_oportunidad = a.id_oportunidad
        JOIN (
          -- Actividad presencial más reciente por ejecutivo
          SELECT id_usuario, MAX(id_actividad) AS id_actividad
            FROM crm_actividad
           WHERE virtual = 0
           GROUP BY id_usuario
        ) ult ON ult.id_usuario = a.id_usuario AND ult.id_actividad = a.id_actividad
       WHERE u.rol = 'EJECUTIVO' AND u.activo = 1;
  END;

  PROCEDURE p_actividades_mapa(p_fecha VARCHAR2, p_cur OUT SYS_REFCURSOR) IS
    l_fecha DATE := NVL(TO_DATE(p_fecha, 'YYYY-MM-DD'), TRUNC(SYSDATE));
  BEGIN
    OPEN p_cur FOR
      SELECT a.id_actividad,
             a.tipo,
             a.asunto,
             a.resultado,
             a.fecha_actividad,
             u.nombre  AS ejecutivo,
             ub.latitud,
             ub.longitud,
             ub.direccion,
             o.titulo  AS oportunidad,
             e.nombre  AS empresa
        FROM crm_actividad a
        JOIN crm_usuario u          ON u.id_usuario     = a.id_usuario
        JOIN crm_ubicacion ub       ON ub.id_actividad  = a.id_actividad
        LEFT JOIN crm_oportunidad o ON o.id_oportunidad = a.id_oportunidad
        LEFT JOIN crm_empresa e     ON e.id_empresa     = o.id_empresa
       WHERE TRUNC(a.fecha_actividad) = l_fecha
         AND a.virtual = 0
       ORDER BY a.fecha_actividad;
  END;

END pkg_monitoreo;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_ANALISIS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_analisis AS

  PROCEDURE p_sectores(p_mes NUMBER, p_anio NUMBER) IS
    l_mes  NUMBER := NVL(p_mes,  EXTRACT(MONTH FROM SYSDATE));
    l_anio NUMBER := NVL(p_anio, EXTRACT(YEAR  FROM SYSDATE));
    l_cur  SYS_REFCURSOR;
  BEGIN
    OPEN l_cur FOR
      SELECT s.id_sector,
             s.nombre  AS sector,
             s.color_hex,
             COUNT(o.id_oportunidad)         AS total_opps,
             NVL(SUM(o.valor_estimado), 0)   AS valor_total,
             NVL(SUM(CASE WHEN eo.tipo='ABIERTO'  THEN o.valor_estimado END), 0) AS pipeline,
             NVL(SUM(CASE WHEN eo.tipo='GANADO'   THEN o.valor_final    END), 0) AS ventas,
             COUNT(CASE WHEN eo.tipo='GANADO'  THEN 1 END) AS opps_ganadas,
             COUNT(CASE WHEN eo.tipo='PERDIDO' THEN 1 END) AS opps_perdidas
        FROM crm_sector s
        LEFT JOIN crm_oportunidad o
             ON o.id_sector = s.id_sector
             AND (p_mes IS NULL
                  OR (EXTRACT(MONTH FROM o.fecha_creacion) = l_mes
                      AND EXTRACT(YEAR  FROM o.fecha_creacion) = l_anio))
        LEFT JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
       GROUP BY s.id_sector, s.nombre, s.color_hex
       ORDER BY valor_total DESC;

    APEX_JSON.OPEN_OBJECT;
      APEX_JSON.WRITE('mes',  l_mes);
      APEX_JSON.WRITE('anio', l_anio);
      APEX_JSON.WRITE('data', l_cur);
    APEX_JSON.CLOSE_OBJECT;
  END;

  PROCEDURE p_forecast(p_meses NUMBER) IS
    l_meses NUMBER := NVL(p_meses, 3);
    l_cur   SYS_REFCURSOR;
  BEGIN
    -- Proyección: oportunidades abiertas con fecha_cierre_estimada en los próximos N meses
    -- ponderadas por probabilidad_cierre
    OPEN l_cur FOR
      SELECT TO_CHAR(ADD_MONTHS(TRUNC(SYSDATE,'MM'), n.nivel - 1), 'YYYY-MM') AS mes,
             EXTRACT(MONTH FROM ADD_MONTHS(TRUNC(SYSDATE,'MM'), n.nivel - 1)) AS num_mes,
             EXTRACT(YEAR  FROM ADD_MONTHS(TRUNC(SYSDATE,'MM'), n.nivel - 1)) AS num_anio,
             NVL(SUM(o.valor_estimado * NVL(o.probabilidad_cierre, 50) / 100), 0) AS forecast_ponderado,
             NVL(SUM(o.valor_estimado), 0)   AS valor_bruto,
             COUNT(o.id_oportunidad)          AS num_opps
        FROM (SELECT LEVEL AS nivel FROM DUAL CONNECT BY LEVEL <= l_meses) n
        LEFT JOIN crm_oportunidad o
             ON TRUNC(o.fecha_cierre_estimada, 'MM') =
                ADD_MONTHS(TRUNC(SYSDATE,'MM'), n.nivel - 1)
        LEFT JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
                                           AND eo.tipo = 'ABIERTO'
       GROUP BY n.nivel,
                ADD_MONTHS(TRUNC(SYSDATE,'MM'), n.nivel - 1)
       ORDER BY n.nivel;

    APEX_JSON.OPEN_OBJECT;
      APEX_JSON.WRITE('meses_proyectados', l_meses);
      APEX_JSON.WRITE('data', l_cur);
    APEX_JSON.CLOSE_OBJECT;
  END;

END pkg_analisis;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_REPORTES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_reportes AS

  PROCEDURE p_list(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    -- Catálogo estático de tipos de reporte disponibles
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
             'Porcentaje de cumplimiento de metas por ejecutivo'        FROM DUAL
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
                OR (l_inicio IS NULL)
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

PROMPT ✓ Package bodies (capa BI) compilados: dashboard, metas, alertas, equipo, monitoreo, analisis, reportes.
