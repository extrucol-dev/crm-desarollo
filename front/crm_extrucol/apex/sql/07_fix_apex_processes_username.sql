-- =============================================================================
-- CRM EXTRUCOL — CORRECCIÓN DE PROCESOS APEX: uso de CRM_SESSION_API
--
-- Problema: los procesos en 01_ y 02_ usaban:
--   SELECT id_usuario ... WHERE UPPER(email) = UPPER(v('APP_USER'))
--   Esto falla cuando el username de APEX es RENE.VILLAZON (no un email).
--
-- Solución: reemplazar por crm_session_api.get_usuario_id()
--   El paquete resuelve por apex_username primero, luego por email.
--
-- Instrucción: copiar cada bloque en el proceso APEX correspondiente
--   (Shared Components → Application Processes → [nombre] → Source)
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- USUARIO_ACTUAL  — proceso de autenticación inicial
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: USUARIO_ACTUAL
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  -- Registrar acceso y obtener perfil
  crm_session_api.registrar_acceso;

  OPEN l_cur FOR
    SELECT id_usuario  AS id,
           nombre,
           UPPER(rol)  AS rol
      FROM crm_usuario
     WHERE id_usuario = crm_session_api.get_usuario_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- LEADS_LIST
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: LEADS_LIST
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
BEGIN
  OPEN l_cur FOR
    SELECT l.id_lead                  AS id,
           l.titulo,
           l.descripcion,
           l.score,
           l.nombre_empresa,
           l.nombre_contacto,
           l.telefono_contacto        AS telefono,
           l.email_contacto           AS email,
           l.fecha_creacion,
           l.fecha_actualizacion,
           el.nombre                  AS estado,
           el.tipo                    AS estado_tipo,
           el.color_hex               AS estado_color,
           ol.nombre                  AS origen,
           ol.color_hex               AS origen_color,
           CASE WHEN l.id_oportunidad_generada IS NOT NULL THEN 1 ELSE 0 END AS convertido
      FROM crm_lead l
      JOIN crm_estado_lead el  ON el.id_estado_lead = l.id_estado_lead
      JOIN crm_origen_lead ol  ON ol.id_origen_lead = l.id_origen_lead
     WHERE l.id_usuario = l_usuario_id
     ORDER BY l.fecha_actualizacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- LEADS_CREATE
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: LEADS_CREATE
DECLARE
  l_id          NUMBER;
  l_usuario_id  NUMBER := crm_session_api.get_usuario_id;
  l_estado_id   NUMBER;
BEGIN
  SELECT id_estado_lead INTO l_estado_id
    FROM (SELECT id_estado_lead FROM crm_estado_lead ORDER BY orden ASC)
   WHERE ROWNUM = 1;

  INSERT INTO crm_lead (
    id_lead, titulo, descripcion, score,
    id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto,
    telefono_contacto, email_contacto,
    fecha_creacion, fecha_actualizacion, id_usuario
  ) VALUES (
    crm_lead_seq.NEXTVAL,
    APEX_APPLICATION.G_X01, APEX_APPLICATION.G_X08, 0,
    l_estado_id,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X05, '')),
    APEX_APPLICATION.G_X02, NULL,
    APEX_APPLICATION.G_X04, APEX_APPLICATION.G_X03,
    SYSDATE, SYSDATE, l_usuario_id
  ) RETURNING id_lead INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id', l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- LEADS_ESTADO
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: LEADS_ESTADO
DECLARE
  l_id         NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_estado_id  NUMBER;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
BEGIN
  SELECT id_estado_lead INTO l_estado_id
    FROM crm_estado_lead
   WHERE UPPER(nombre) = UPPER(APEX_APPLICATION.G_X02);

  INSERT INTO crm_historial_estado_lead (
    id_historial_lead, id_lead,
    id_estado_anterior, id_estado_nuevo,
    fecha_cambio, id_usuario
  )
  SELECT crm_hist_lead_seq.NEXTVAL, l_id,
         id_estado_lead, l_estado_id, SYSDATE, l_usuario_id
    FROM crm_lead WHERE id_lead = l_id;

  UPDATE crm_lead
     SET id_estado_lead = l_estado_id, fecha_actualizacion = SYSDATE
   WHERE id_lead = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- LEADS_CONVERTIR
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: LEADS_CONVERTIR
DECLARE
  l_lead_id    NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_opp_id     NUMBER;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
  l_estado_id  NUMBER;
  l_empresa_id NUMBER;
BEGIN
  SELECT id_estado INTO l_estado_id
    FROM (SELECT id_estado FROM crm_estado_oportunidad WHERE tipo = 'ABIERTO' ORDER BY orden ASC)
   WHERE ROWNUM = 1;

  BEGIN
    SELECT id_empresa INTO l_empresa_id
      FROM crm_empresa
     WHERE nombre = (SELECT nombre_empresa FROM crm_lead WHERE id_lead = l_lead_id)
       AND ROWNUM = 1;
  EXCEPTION WHEN NO_DATA_FOUND THEN l_empresa_id := NULL;
  END;

  INSERT INTO crm_oportunidad (
    id_oportunidad, titulo, id_estado_oportunidad,
    valor_estimado, fecha_cierre_estimada,
    fecha_creacion, fecha_actualizacion,
    id_empresa, id_usuario, id_lead_origen
  ) VALUES (
    crm_oportunidad_seq.NEXTVAL, APEX_APPLICATION.G_X02, l_estado_id,
    TO_NUMBER(NULLIF(REPLACE(APEX_APPLICATION.G_X03, ',', '.'), '')),
    TO_DATE(NULLIF(APEX_APPLICATION.G_X04, ''), 'YYYY-MM-DD'),
    SYSDATE, SYSDATE, l_empresa_id, l_usuario_id, l_lead_id
  ) RETURNING id_oportunidad INTO l_opp_id;

  UPDATE crm_lead
     SET id_oportunidad_generada = l_opp_id, fecha_actualizacion = SYSDATE
   WHERE id_lead = l_lead_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id_oportunidad', l_opp_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- OPORTUNIDADES_LIST
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_LIST
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
BEGIN
  OPEN l_cur FOR
    SELECT o.id_oportunidad AS id, o.titulo, o.descripcion,
           o.valor_estimado, o.probabilidad_cierre,
           o.fecha_cierre_estimada, o.fecha_actualizacion,
           eo.id_estado AS estado_id, eo.nombre AS estado,
           eo.tipo AS estado_tipo, eo.orden AS estado_orden,
           tp.nombre AS tipo, s.nombre AS sector,
           e.nombre AS empresa, e.id_empresa AS empresa_id
      FROM crm_oportunidad o
      JOIN crm_estado_oportunidad eo ON eo.id_estado            = o.id_estado_oportunidad
      LEFT JOIN crm_tipo_oportunidad tp ON tp.id_tipo_oportunidad = o.id_tipo_oportunidad
      LEFT JOIN crm_sector s            ON s.id_sector           = o.id_sector
      LEFT JOIN crm_empresa e           ON e.id_empresa          = o.id_empresa
     WHERE o.id_usuario = l_usuario_id
     ORDER BY eo.orden, o.fecha_actualizacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- OPORTUNIDADES_CREATE
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_CREATE
DECLARE
  l_id         NUMBER;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
  l_estado_id  NUMBER;
BEGIN
  SELECT id_estado INTO l_estado_id
    FROM (SELECT id_estado FROM crm_estado_oportunidad WHERE tipo = 'ABIERTO' ORDER BY orden ASC)
   WHERE ROWNUM = 1;

  INSERT INTO crm_oportunidad (
    id_oportunidad, titulo, descripcion,
    id_tipo_oportunidad, id_estado_oportunidad,
    valor_estimado, fecha_cierre_estimada,
    fecha_creacion, fecha_actualizacion,
    id_empresa, id_usuario
  ) VALUES (
    crm_oportunidad_seq.NEXTVAL,
    APEX_APPLICATION.G_X01, APEX_APPLICATION.G_X02,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X03, '')), l_estado_id,
    TO_NUMBER(NULLIF(REPLACE(APEX_APPLICATION.G_X04, ',', '.'), '')),
    TO_DATE(NULLIF(APEX_APPLICATION.G_X05, ''), 'YYYY-MM-DD'),
    SYSDATE, SYSDATE,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X06, '')), l_usuario_id
  ) RETURNING id_oportunidad INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id', l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- OPORTUNIDADES_AVANZAR
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_AVANZAR
DECLARE
  l_id         NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_estado_id  NUMBER;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
BEGIN
  SELECT id_estado INTO l_estado_id
    FROM crm_estado_oportunidad
   WHERE UPPER(nombre) = UPPER(APEX_APPLICATION.G_X02);

  INSERT INTO crm_historial_estado (
    id_historial, id_oportunidad,
    id_estado_anterior, id_estado_nuevo,
    fecha_cambio, id_usuario
  )
  SELECT crm_hist_opp_seq.NEXTVAL, l_id,
         id_estado_oportunidad, l_estado_id, SYSDATE, l_usuario_id
    FROM crm_oportunidad WHERE id_oportunidad = l_id;

  UPDATE crm_oportunidad
     SET id_estado_oportunidad = l_estado_id, fecha_actualizacion = SYSDATE
   WHERE id_oportunidad = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- OPORTUNIDADES_CERRAR
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_CERRAR
DECLARE
  l_id         NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_estado_id  NUMBER;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
BEGIN
  SELECT id_estado INTO l_estado_id
    FROM crm_estado_oportunidad
   WHERE UPPER(nombre) = UPPER(APEX_APPLICATION.G_X02);

  INSERT INTO crm_historial_estado (
    id_historial, id_oportunidad,
    id_estado_anterior, id_estado_nuevo,
    fecha_cambio, id_usuario
  )
  SELECT crm_hist_opp_seq.NEXTVAL, l_id,
         id_estado_oportunidad, l_estado_id, SYSDATE, l_usuario_id
    FROM crm_oportunidad WHERE id_oportunidad = l_id;

  UPDATE crm_oportunidad
     SET id_estado_oportunidad = l_estado_id,
         fecha_cierre_estimada = TO_DATE(NULLIF(APEX_APPLICATION.G_X03,''), 'YYYY-MM-DD'),
         id_motivo_cierre      = TO_NUMBER(NULLIF(APEX_APPLICATION.G_X04, '')),
         fecha_actualizacion   = SYSDATE
   WHERE id_oportunidad = l_id;

  UPDATE crm_empresa SET nuevo = 0
   WHERE id_empresa = (SELECT id_empresa FROM crm_oportunidad WHERE id_oportunidad = l_id)
     AND UPPER(APEX_APPLICATION.G_X02) = 'GANADA';

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- ACTIVIDADES_LIST_MIS
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ACTIVIDADES_LIST_MIS
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
  l_inicio     DATE   := TO_DATE(NULLIF(APEX_APPLICATION.G_X01,''), 'YYYY-MM-DD');
  l_fin        DATE   := TO_DATE(NULLIF(APEX_APPLICATION.G_X02,''), 'YYYY-MM-DD');
BEGIN
  OPEN l_cur FOR
    SELECT a.id_actividad AS id, a.tipo, a.asunto, a.descripcion,
           a.resultado, a.virtual, a.fecha_actividad, a.fecha_creacion,
           o.titulo AS oportunidad, o.id_oportunidad,
           l.titulo AS lead_titulo, l.id_lead,
           ub.latitud, ub.longitud
      FROM crm_actividad a
      LEFT JOIN crm_oportunidad o ON o.id_oportunidad = a.id_oportunidad
      LEFT JOIN crm_lead l        ON l.id_lead        = a.id_lead
      LEFT JOIN crm_ubicacion ub  ON ub.id_actividad  = a.id_actividad
     WHERE a.id_usuario = l_usuario_id
       AND (l_inicio IS NULL OR TRUNC(a.fecha_actividad) >= l_inicio)
       AND (l_fin    IS NULL OR TRUNC(a.fecha_actividad) <= l_fin)
     ORDER BY a.fecha_actividad DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- ACTIVIDADES_CREATE
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ACTIVIDADES_CREATE
DECLARE
  l_id         NUMBER;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
BEGIN
  INSERT INTO crm_actividad (
    id_actividad, tipo, asunto, virtual,
    fecha_actividad, fecha_creacion,
    id_oportunidad, id_lead, id_usuario
  ) VALUES (
    crm_actividad_seq.NEXTVAL,
    UPPER(APEX_APPLICATION.G_X01), APEX_APPLICATION.G_X02,
    CASE WHEN APEX_APPLICATION.G_X03 = '1' THEN 1 ELSE 0 END,
    TO_DATE(NULLIF(APEX_APPLICATION.G_X04,''), 'YYYY-MM-DD'),
    SYSDATE,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X05,'')),
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X06,'')),
    l_usuario_id
  ) RETURNING id_actividad INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id', l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PROYECTOS_LIST
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: PROYECTOS_LIST
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
BEGIN
  OPEN l_cur FOR
    SELECT p.id_proyecto AS id, p.nombre, p.descripcion,
           p.estado, p.porcentaje_completado,
           p.fecha_inicio, p.fecha_fin, p.fecha_creacion,
           o.titulo AS oportunidad, o.id_oportunidad,
           e.nombre AS empresa
      FROM crm_proyecto p
      JOIN crm_oportunidad o ON o.id_oportunidad = p.id_oportunidad
      LEFT JOIN crm_empresa e ON e.id_empresa    = o.id_empresa
     WHERE p.id_usuario = l_usuario_id
     ORDER BY p.fecha_creacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PROYECTOS_CREATE
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: PROYECTOS_CREATE
DECLARE
  l_id         NUMBER;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
BEGIN
  INSERT INTO crm_proyecto (
    id_proyecto, nombre, descripcion, estado,
    porcentaje_completado, fecha_creacion, fecha_actualizacion,
    id_oportunidad, id_usuario
  ) VALUES (
    crm_proyecto_seq.NEXTVAL,
    APEX_APPLICATION.G_X01, APEX_APPLICATION.G_X02,
    'PLANIFICACION', 0, SYSDATE, SYSDATE,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X03,'')), l_usuario_id
  ) RETURNING id_proyecto INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id', l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- DASHBOARD_EJECUTIVO
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: DASHBOARD_EJECUTIVO
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
  l_mes        NUMBER := EXTRACT(MONTH FROM SYSDATE);
  l_anio       NUMBER := EXTRACT(YEAR  FROM SYSDATE);
BEGIN
  OPEN l_cur FOR
    SELECT
      (SELECT NVL(SUM(o.valor_estimado),0) FROM crm_oportunidad o
         JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
        WHERE o.id_usuario = l_usuario_id AND eo.tipo = 'GANADO'
          AND EXTRACT(MONTH FROM o.fecha_actualizacion) = l_mes
          AND EXTRACT(YEAR  FROM o.fecha_actualizacion) = l_anio
      ) AS ventas_mes,
      (SELECT COUNT(*) FROM crm_oportunidad o
         JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
        WHERE o.id_usuario = l_usuario_id AND eo.tipo = 'ABIERTO'
      ) AS oportunidades_activas,
      (SELECT COUNT(*) FROM crm_lead l
         JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
        WHERE l.id_usuario = l_usuario_id AND el.tipo = 'ABIERTO'
          AND l.id_oportunidad_generada IS NULL
      ) AS leads_activos,
      (SELECT COUNT(*) FROM crm_actividad a
        WHERE a.id_usuario = l_usuario_id
          AND a.fecha_actividad >= TRUNC(SYSDATE,'IW')
          AND a.fecha_actividad <  TRUNC(SYSDATE,'IW') + 7
      ) AS actividades_semana,
      NVL((SELECT MAX(cm.pct_cumplimiento) FROM crm_cumplimiento_meta cm
            JOIN crm_meta m ON m.id_meta = cm.id_meta
           WHERE cm.id_usuario = l_usuario_id AND m.metrica = 'VENTAS_MES'
             AND cm.mes = l_mes AND cm.anio = l_anio), 0) AS meta_ventas_pct
    FROM DUAL;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- METAS_MIS_METAS
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: METAS_MIS_METAS
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
  l_mes        NUMBER := NVL(TO_NUMBER(NULLIF(APEX_APPLICATION.G_X01,'')), EXTRACT(MONTH FROM SYSDATE));
  l_anio       NUMBER := NVL(TO_NUMBER(NULLIF(APEX_APPLICATION.G_X02,'')), EXTRACT(YEAR  FROM SYSDATE));
BEGIN
  OPEN l_cur FOR
    SELECT m.id_meta, m.nombre, m.descripcion, m.metrica,
           m.valor_meta, m.unidad, m.periodo,
           NVL(cm.valor_actual, 0)     AS valor_actual,
           NVL(cm.pct_cumplimiento, 0) AS pct_cumplimiento,
           cm.fecha_calculo
      FROM crm_meta m
      LEFT JOIN crm_cumplimiento_meta cm
             ON cm.id_meta = m.id_meta AND cm.id_usuario = l_usuario_id
            AND cm.mes = l_mes AND cm.anio = l_anio
     WHERE m.activo = 1
       AND (m.id_usuario IS NULL OR m.id_usuario = l_usuario_id)
     ORDER BY m.metrica;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- ALERTAS_LIST
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ALERTAS_LIST
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
BEGIN
  OPEN l_cur FOR
    SELECT n.id_notificacion AS id, n.tipo, n.titulo,
           n.mensaje, n.leida, n.fecha_creacion,
           n.id_lead, n.id_oportunidad,
           uo.nombre AS origen_nombre
      FROM crm_notificacion n
      LEFT JOIN crm_usuario uo ON uo.id_usuario = n.id_usuario_origen
     WHERE n.id_usuario_destino = l_usuario_id AND n.leida = 0
     ORDER BY n.tipo DESC, n.fecha_creacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- ALERTAS_LOG
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ALERTAS_LOG
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER := crm_session_api.get_usuario_id;
  l_inicio     DATE   := TO_DATE(NULLIF(APEX_APPLICATION.G_X01,''), 'YYYY-MM-DD');
  l_fin        DATE   := TO_DATE(NULLIF(APEX_APPLICATION.G_X02,''), 'YYYY-MM-DD');
BEGIN
  OPEN l_cur FOR
    SELECT n.id_notificacion AS id, n.tipo, n.titulo,
           n.mensaje, n.leida, n.fecha_creacion,
           n.fecha_lectura, n.canal, n.id_lead, n.id_oportunidad
      FROM crm_notificacion n
     WHERE n.id_usuario_destino = l_usuario_id
       AND (l_inicio IS NULL OR TRUNC(n.fecha_creacion) >= l_inicio)
       AND (l_fin    IS NULL OR TRUNC(n.fecha_creacion) <= l_fin)
     ORDER BY n.fecha_creacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- =============================================================================
-- SEED: vincular usuarios existentes con su apex_username
--
-- Ejecutar una sola vez después de crear los usuarios en APEX Workspace.
-- Reemplazar los valores según los usernames reales de APEX.
-- =============================================================================

/*
UPDATE crm_usuario SET apex_username = 'RENE.VILLAZON'    WHERE email = 'rene.villazon@extrucol.com';
UPDATE crm_usuario SET apex_username = 'JUAN.PEREZ'       WHERE email = 'juan.perez@extrucol.com';
UPDATE crm_usuario SET apex_username = 'MARIA.GARCIA'     WHERE email = 'maria.garcia@extrucol.com';
UPDATE crm_usuario SET apex_username = 'CARLOS.RODRIGUEZ' WHERE email = 'carlos.rodriguez@extrucol.com';
COMMIT;
*/

-- Verificar asignación:
-- SELECT apex_username, email, nombre, rol FROM crm_usuario ORDER BY rol, nombre;


-- =============================================================================
-- DIAGNÓSTICO: ejecutar desde SQL Workshop si un usuario no puede entrar
-- =============================================================================

/*
-- 1. ¿Qué devuelve v('APP_USER') para la sesión activa?
SELECT v('APP_USER') AS apex_user FROM DUAL;

-- 2. ¿Existe ese username en CRM_USUARIO?
SELECT id_usuario, nombre, rol, apex_username, email, activo
  FROM crm_usuario
 WHERE UPPER(apex_username) = UPPER(v('APP_USER'))
    OR UPPER(email)         = UPPER(v('APP_USER'));

-- 3. Simular USUARIO_ACTUAL para un username específico
SELECT id_usuario, nombre, rol
  FROM crm_usuario
 WHERE UPPER(apex_username) = UPPER('RENE.VILLAZON')
    OR (apex_username IS NULL AND UPPER(email) = UPPER('RENE.VILLAZON'));
*/
