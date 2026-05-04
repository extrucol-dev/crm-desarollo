-- =============================================================================
-- CRM EXTRUCOL — APEX Application Processes  (PARTE 2 de 2)
-- Procesos 22-50: Actividades, Proyectos, Usuarios, Dashboard,
--                 Metas, Alertas, Equipo, Monitoreo, Análisis, Reportes,
--                 Configuración
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 22. ACTIVIDADES_LIST_MIS  (x01=inicio YYYY-MM-DD?, x02=fin?)
--     Actividades del ejecutivo de sesión, con filtro de fecha opcional.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ACTIVIDADES_LIST_MIS
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER;
  l_inicio     DATE := TO_DATE(NULLIF(APEX_APPLICATION.G_X01,''), 'YYYY-MM-DD');
  l_fin        DATE := TO_DATE(NULLIF(APEX_APPLICATION.G_X02,''), 'YYYY-MM-DD');
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  OPEN l_cur FOR
    SELECT a.id_actividad  AS id,
           a.tipo,
           a.asunto,
           a.descripcion,
           a.resultado,
           a.virtual,
           a.fecha_actividad,
           a.fecha_creacion,
           o.titulo        AS oportunidad,
           o.id_oportunidad,
           l.titulo        AS lead_titulo,
           l.id_lead,
           ub.latitud,
           ub.longitud
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
-- 23. ACTIVIDADES_LIST_TODAS  (x01=inicio?, x02=fin?)
--     Director/coordinador: todas las actividades del equipo.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ACTIVIDADES_LIST_TODAS
DECLARE
  l_cur    SYS_REFCURSOR;
  l_inicio DATE := TO_DATE(NULLIF(APEX_APPLICATION.G_X01,''), 'YYYY-MM-DD');
  l_fin    DATE := TO_DATE(NULLIF(APEX_APPLICATION.G_X02,''), 'YYYY-MM-DD');
BEGIN
  OPEN l_cur FOR
    SELECT a.id_actividad  AS id,
           a.tipo,
           a.asunto,
           a.descripcion,
           a.resultado,
           a.virtual,
           a.fecha_actividad,
           o.titulo        AS oportunidad,
           o.id_oportunidad,
           u.nombre        AS ejecutivo,
           u.id_usuario    AS ejecutivo_id,
           ub.latitud,
           ub.longitud
      FROM crm_actividad a
      JOIN crm_usuario u          ON u.id_usuario    = a.id_usuario
      LEFT JOIN crm_oportunidad o ON o.id_oportunidad= a.id_oportunidad
      LEFT JOIN crm_ubicacion ub  ON ub.id_actividad = a.id_actividad
     WHERE (l_inicio IS NULL OR TRUNC(a.fecha_actividad) >= l_inicio)
       AND (l_fin    IS NULL OR TRUNC(a.fecha_actividad) <= l_fin)
     ORDER BY a.fecha_actividad DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 24. ACTIVIDADES_GET  (x01 = id_actividad)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ACTIVIDADES_GET
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT a.id_actividad  AS id,
           a.tipo,
           a.asunto,
           a.descripcion,
           a.resultado,
           a.virtual,
           a.fecha_actividad,
           a.fecha_creacion,
           a.id_oportunidad,
           a.id_lead,
           o.titulo        AS oportunidad,
           u.nombre        AS ejecutivo,
           ub.latitud,
           ub.longitud,
           ub.direccion
      FROM crm_actividad a
      JOIN crm_usuario u          ON u.id_usuario    = a.id_usuario
      LEFT JOIN crm_oportunidad o ON o.id_oportunidad= a.id_oportunidad
      LEFT JOIN crm_ubicacion ub  ON ub.id_actividad = a.id_actividad
     WHERE a.id_actividad = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 25. ACTIVIDADES_CREATE
--     x01=tipo, x02=asunto, x03=virtual(1/0), x04=fecha_actividad(YYYY-MM-DD),
--     x05=oportunidad_id, x06=lead_id (opcional)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ACTIVIDADES_CREATE
DECLARE
  l_id         NUMBER;
  l_usuario_id NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  INSERT INTO crm_actividad (
    id_actividad, tipo, asunto,
    virtual, fecha_actividad, fecha_creacion,
    id_oportunidad, id_lead, id_usuario
  ) VALUES (
    crm_actividad_seq.NEXTVAL,
    UPPER(APEX_APPLICATION.G_X01),
    APEX_APPLICATION.G_X02,
    CASE WHEN APEX_APPLICATION.G_X03 = '1' THEN 1 ELSE 0 END,
    TO_DATE(NULLIF(APEX_APPLICATION.G_X04,''), 'YYYY-MM-DD'),
    SYSDATE,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X05,'')),
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X06,'')),
    l_usuario_id
  ) RETURNING id_actividad INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id',      l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 26. ACTIVIDADES_UPDATE
--     x01=id, x02=tipo, x03=asunto, x04=virtual(1/0),
--     x05=fecha_actividad (YYYY-MM-DD), x06=oportunidad_id
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ACTIVIDADES_UPDATE
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_actividad
     SET tipo           = UPPER(APEX_APPLICATION.G_X02),
         asunto         = APEX_APPLICATION.G_X03,
         virtual        = CASE WHEN APEX_APPLICATION.G_X04='1' THEN 1 ELSE 0 END,
         fecha_actividad= TO_DATE(NULLIF(APEX_APPLICATION.G_X05,''), 'YYYY-MM-DD'),
         id_oportunidad = TO_NUMBER(NULLIF(APEX_APPLICATION.G_X06,''))
   WHERE id_actividad = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
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
-- 27. ACTIVIDADES_CERRAR
--     x01=id_actividad, x02=resultado, x03=latitud, x04=longitud
--     Guarda resultado y ubicación GPS del cierre.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ACTIVIDADES_CERRAR
DECLARE
  l_id   NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_lat  NUMBER;
  l_lon  NUMBER;
BEGIN
  l_lat := TO_NUMBER(NULLIF(REPLACE(APEX_APPLICATION.G_X03,',','.'), ''));
  l_lon := TO_NUMBER(NULLIF(REPLACE(APEX_APPLICATION.G_X04,',','.'), ''));

  UPDATE crm_actividad
     SET resultado = APEX_APPLICATION.G_X02
   WHERE id_actividad = l_id;

  IF l_lat IS NOT NULL AND l_lon IS NOT NULL THEN
    MERGE INTO crm_ubicacion ub
    USING (SELECT l_id AS id_actividad FROM DUAL) src
       ON (ub.id_actividad = src.id_actividad)
     WHEN MATCHED THEN
       UPDATE SET ub.latitud  = l_lat,
                  ub.longitud = l_lon
     WHEN NOT MATCHED THEN
       INSERT (id_ubicacion, latitud, longitud, id_actividad)
       VALUES (crm_ubicacion_seq.NEXTVAL, l_lat, l_lon, l_id);
  END IF;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT >= 0);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 28. PROYECTOS_LIST  — del ejecutivo de sesión
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: PROYECTOS_LIST
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  OPEN l_cur FOR
    SELECT p.id_proyecto           AS id,
           p.nombre,
           p.descripcion,
           p.estado,
           p.porcentaje_completado,
           p.fecha_inicio,
           p.fecha_fin,
           p.fecha_creacion,
           o.titulo               AS oportunidad,
           o.id_oportunidad,
           e.nombre               AS empresa
      FROM crm_proyecto p
      JOIN crm_oportunidad o ON o.id_oportunidad = p.id_oportunidad
      LEFT JOIN crm_empresa e ON e.id_empresa = o.id_empresa
     WHERE p.id_usuario = l_usuario_id
     ORDER BY p.fecha_creacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 29. PROYECTOS_LIST_TODOS  — director, todos los proyectos
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: PROYECTOS_LIST_TODOS
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT p.id_proyecto           AS id,
           p.nombre,
           p.estado,
           p.porcentaje_completado,
           p.fecha_inicio,
           p.fecha_fin,
           o.titulo               AS oportunidad,
           e.nombre               AS empresa,
           u.nombre               AS ejecutivo
      FROM crm_proyecto p
      JOIN crm_oportunidad o ON o.id_oportunidad = p.id_oportunidad
      JOIN crm_usuario u     ON u.id_usuario     = p.id_usuario
      LEFT JOIN crm_empresa e ON e.id_empresa    = o.id_empresa
     ORDER BY p.fecha_creacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 30. PROYECTOS_GET  (x01 = id_proyecto)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: PROYECTOS_GET
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT p.id_proyecto           AS id,
           p.nombre,
           p.descripcion,
           p.estado,
           p.porcentaje_completado,
           p.fecha_inicio,
           p.fecha_fin,
           p.fecha_creacion,
           o.id_oportunidad,
           o.titulo               AS oportunidad,
           e.nombre               AS empresa,
           u.nombre               AS ejecutivo,
           CURSOR(
             SELECT h.id_hito, h.titulo, h.estado, h.orden,
                    h.fecha_planificada, h.fecha_completado
               FROM crm_proyecto_hito h
              WHERE h.id_proyecto = p.id_proyecto
              ORDER BY h.orden
           ) AS hitos
      FROM crm_proyecto p
      JOIN crm_oportunidad o ON o.id_oportunidad = p.id_oportunidad
      JOIN crm_usuario u     ON u.id_usuario     = p.id_usuario
      LEFT JOIN crm_empresa e ON e.id_empresa    = o.id_empresa
     WHERE p.id_proyecto = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 31. PROYECTOS_CREATE
--     x01=nombre, x02=descripcion, x03=oportunidad_id
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: PROYECTOS_CREATE
DECLARE
  l_id         NUMBER;
  l_usuario_id NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  INSERT INTO crm_proyecto (
    id_proyecto, nombre, descripcion, estado,
    porcentaje_completado, fecha_creacion, fecha_actualizacion,
    id_oportunidad, id_usuario
  ) VALUES (
    crm_proyecto_seq.NEXTVAL,
    APEX_APPLICATION.G_X01,
    APEX_APPLICATION.G_X02,
    'PLANIFICACION',
    0, SYSDATE, SYSDATE,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X03,'')),
    l_usuario_id
  ) RETURNING id_proyecto INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id',      l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 32. PROYECTOS_UPDATE
--     x01=id, x02=nombre, x03=descripcion, x04=estado, x05=oportunidad_id
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: PROYECTOS_UPDATE
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_proyecto
     SET nombre             = APEX_APPLICATION.G_X02,
         descripcion        = APEX_APPLICATION.G_X03,
         estado             = APEX_APPLICATION.G_X04,
         id_oportunidad     = TO_NUMBER(NULLIF(APEX_APPLICATION.G_X05,'')),
         fecha_actualizacion= SYSDATE
   WHERE id_proyecto = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
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
-- 33. PROYECTOS_ESTADO  (x01=id_proyecto, x02=estado_nuevo)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: PROYECTOS_ESTADO
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_proyecto
     SET estado              = UPPER(APEX_APPLICATION.G_X02),
         fecha_actualizacion = SYSDATE
   WHERE id_proyecto = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
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
-- 34. USUARIOS_LIST
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: USUARIOS_LIST
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT u.id_usuario  AS id,
           u.nombre,
           u.email,
           UPPER(u.rol)  AS rol,
           u.activo,
           u.fecha_creacion,
           u.ultimo_acceso,
           d.nombre      AS departamento
      FROM crm_usuario u
      LEFT JOIN crm_departamento d ON d.id_departamento = u.id_departamento
     ORDER BY u.nombre;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 35. USUARIOS_GET  (x01 = id_usuario)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: USUARIOS_GET
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT u.id_usuario  AS id,
           u.nombre,
           u.email,
           UPPER(u.rol)  AS rol,
           u.activo,
           u.fecha_creacion,
           u.ultimo_acceso,
           u.id_departamento,
           d.nombre      AS departamento
      FROM crm_usuario u
      LEFT JOIN crm_departamento d ON d.id_departamento = u.id_departamento
     WHERE u.id_usuario = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 36. USUARIOS_CREATE
--     x01=nombre, x02=email, x03=rol, x04=departamento_id
--     Nota: el password inicial se gestiona fuera de este proceso
--     (APEX crea el usuario de workspace por separado).
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: USUARIOS_CREATE
DECLARE
  l_id NUMBER;
BEGIN
  INSERT INTO crm_usuario (
    id_usuario, nombre, email, rol,
    activo, fecha_creacion, id_departamento,
    password
  ) VALUES (
    crm_usuario_seq.NEXTVAL,
    APEX_APPLICATION.G_X01,
    LOWER(APEX_APPLICATION.G_X02),
    UPPER(APEX_APPLICATION.G_X03),
    1, SYSDATE,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X04,'')),
    'APEX_MANAGED'   -- marcador: auth manejada por APEX workspace
  ) RETURNING id_usuario INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id',      l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 37. USUARIOS_UPDATE
--     x01=id, x02=nombre, x03=email, x04=rol, x05=departamento_id
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: USUARIOS_UPDATE
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_usuario
     SET nombre          = APEX_APPLICATION.G_X02,
         email           = LOWER(APEX_APPLICATION.G_X03),
         rol             = UPPER(APEX_APPLICATION.G_X04),
         id_departamento = TO_NUMBER(NULLIF(APEX_APPLICATION.G_X05,''))
   WHERE id_usuario = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
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
-- 38. USUARIOS_ESTADO  (x01=id, x02=activo 1/0)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: USUARIOS_ESTADO
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_usuario
     SET activo = CASE WHEN APEX_APPLICATION.G_X02 = '1' THEN 1 ELSE 0 END
   WHERE id_usuario = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
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
-- 39. DASHBOARD_EJECUTIVO
--     KPIs del ejecutivo logueado: ventas, oportunidades activas, leads,
--     actividades semana, metas del mes.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: DASHBOARD_EJECUTIVO
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER;
  l_mes        NUMBER := EXTRACT(MONTH FROM SYSDATE);
  l_anio       NUMBER := EXTRACT(YEAR  FROM SYSDATE);
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  OPEN l_cur FOR
    SELECT
      -- Ventas del mes (oportunidades ganadas)
      (SELECT NVL(SUM(o.valor_estimado), 0)
         FROM crm_oportunidad o
         JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
        WHERE o.id_usuario = l_usuario_id
          AND eo.tipo      = 'GANADO'
          AND EXTRACT(MONTH FROM o.fecha_actualizacion) = l_mes
          AND EXTRACT(YEAR  FROM o.fecha_actualizacion) = l_anio
      ) AS ventas_mes,
      -- Oportunidades activas
      (SELECT COUNT(*) FROM crm_oportunidad o
         JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
        WHERE o.id_usuario = l_usuario_id AND eo.tipo = 'ABIERTO'
      ) AS oportunidades_activas,
      -- Leads activos
      (SELECT COUNT(*) FROM crm_lead l
         JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
        WHERE l.id_usuario = l_usuario_id AND el.tipo = 'ABIERTO'
          AND l.id_oportunidad_generada IS NULL
      ) AS leads_activos,
      -- Actividades esta semana
      (SELECT COUNT(*) FROM crm_actividad a
        WHERE a.id_usuario    = l_usuario_id
          AND a.fecha_actividad >= TRUNC(SYSDATE, 'IW')
          AND a.fecha_actividad <  TRUNC(SYSDATE, 'IW') + 7
      ) AS actividades_semana,
      -- Meta ventas mes (pct cumplimiento)
      (SELECT NVL(MAX(cm.pct_cumplimiento), 0)
         FROM crm_cumplimiento_meta cm
         JOIN crm_meta mt ON mt.id_meta = cm.id_meta
        WHERE cm.id_usuario = l_usuario_id
          AND mt.metrica = 'VENTAS_MES'
          AND cm.mes = l_mes AND cm.anio = l_anio
      ) AS meta_ventas_pct,
      -- Clientes nuevos mes
      (SELECT COUNT(DISTINCT o.id_empresa)
         FROM crm_oportunidad o
         JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
         JOIN crm_empresa e ON e.id_empresa = o.id_empresa
        WHERE o.id_usuario = l_usuario_id
          AND eo.tipo = 'GANADO'
          AND e.nuevo = 1
          AND EXTRACT(MONTH FROM o.fecha_actualizacion) = l_mes
          AND EXTRACT(YEAR  FROM o.fecha_actualizacion) = l_anio
      ) AS clientes_nuevos_mes
    FROM DUAL;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 40. DASHBOARD_COORDINADOR
--     KPIs de supervisión: resumen del equipo bajo coordinación.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: DASHBOARD_COORDINADOR
DECLARE
  l_cur SYS_REFCURSOR;
  l_mes  NUMBER := EXTRACT(MONTH FROM SYSDATE);
  l_anio NUMBER := EXTRACT(YEAR  FROM SYSDATE);
BEGIN
  OPEN l_cur FOR
    SELECT
      (SELECT COUNT(*) FROM crm_usuario WHERE rol = 'EJECUTIVO' AND activo = 1)
        AS total_ejecutivos,
      (SELECT NVL(SUM(o.valor_estimado), 0)
         FROM crm_oportunidad o
         JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
         JOIN crm_usuario u             ON u.id_usuario = o.id_usuario
        WHERE eo.tipo = 'GANADO'
          AND u.rol = 'EJECUTIVO'
          AND EXTRACT(MONTH FROM o.fecha_actualizacion) = l_mes
          AND EXTRACT(YEAR  FROM o.fecha_actualizacion) = l_anio
      ) AS ventas_equipo_mes,
      (SELECT COUNT(*) FROM crm_oportunidad o
         JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
         JOIN crm_usuario u             ON u.id_usuario = o.id_usuario
        WHERE eo.tipo = 'ABIERTO' AND u.rol = 'EJECUTIVO'
      ) AS oportunidades_activas,
      (SELECT COUNT(*) FROM crm_notificacion
        WHERE tipo IN ('CRITICA','ADVERTENCIA') AND leida = 0
      ) AS alertas_activas,
      (SELECT ROUND(AVG(cm.pct_cumplimiento))
         FROM crm_cumplimiento_meta cm
         JOIN crm_usuario u ON u.id_usuario = cm.id_usuario
        WHERE u.rol = 'EJECUTIVO'
          AND cm.mes = l_mes AND cm.anio = l_anio
      ) AS cumplimiento_promedio
    FROM DUAL;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 41. METAS_MIS_METAS  (x01=mes?, x02=anio?)
--     Metas del ejecutivo con su cumplimiento del período.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: METAS_MIS_METAS
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER;
  l_mes        NUMBER := NVL(TO_NUMBER(NULLIF(APEX_APPLICATION.G_X01,'')), EXTRACT(MONTH FROM SYSDATE));
  l_anio       NUMBER := NVL(TO_NUMBER(NULLIF(APEX_APPLICATION.G_X02,'')), EXTRACT(YEAR  FROM SYSDATE));
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  OPEN l_cur FOR
    SELECT m.id_meta,
           m.nombre,
           m.descripcion,
           m.metrica,
           m.valor_meta,
           m.unidad,
           m.periodo,
           NVL(cm.valor_actual, 0)       AS valor_actual,
           NVL(cm.pct_cumplimiento, 0)   AS pct_cumplimiento,
           cm.fecha_calculo
      FROM crm_meta m
      LEFT JOIN crm_cumplimiento_meta cm
             ON cm.id_meta    = m.id_meta
            AND cm.id_usuario = l_usuario_id
            AND cm.mes        = l_mes
            AND cm.anio       = l_anio
     WHERE m.activo = 1
       AND (m.id_usuario IS NULL OR m.id_usuario = l_usuario_id)
     ORDER BY m.metrica;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 42. METAS_CUMPLIMIENTO  (x01=mes?, x02=anio?)
--     Resumen de cumplimiento por ejecutivo para el coordinador.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: METAS_CUMPLIMIENTO
DECLARE
  l_cur  SYS_REFCURSOR;
  l_mes  NUMBER := NVL(TO_NUMBER(NULLIF(APEX_APPLICATION.G_X01,'')), EXTRACT(MONTH FROM SYSDATE));
  l_anio NUMBER := NVL(TO_NUMBER(NULLIF(APEX_APPLICATION.G_X02,'')), EXTRACT(YEAR  FROM SYSDATE));
BEGIN
  OPEN l_cur FOR
    SELECT u.id_usuario,
           u.nombre        AS ejecutivo,
           COUNT(cm.id_cumplimiento)           AS total_metas,
           SUM(CASE WHEN cm.pct_cumplimiento >= 100 THEN 1 ELSE 0 END) AS metas_cumplidas,
           ROUND(AVG(NVL(cm.pct_cumplimiento, 0)))                     AS pct_promedio,
           NVL(SUM(CASE WHEN m.metrica = 'VENTAS_MES' THEN cm.valor_actual ELSE 0 END), 0) AS ventas_mes
      FROM crm_usuario u
      LEFT JOIN crm_cumplimiento_meta cm ON cm.id_usuario = u.id_usuario
                                        AND cm.mes = l_mes AND cm.anio = l_anio
      LEFT JOIN crm_meta m ON m.id_meta = cm.id_meta
     WHERE u.rol = 'EJECUTIVO' AND u.activo = 1
     GROUP BY u.id_usuario, u.nombre
     ORDER BY pct_promedio DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 43. ALERTAS_LIST
--     Notificaciones no leídas del usuario de sesión (+ críticas del sistema).
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ALERTAS_LIST
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  OPEN l_cur FOR
    SELECT n.id_notificacion  AS id,
           n.tipo,
           n.titulo,
           n.mensaje,
           n.leida,
           n.fecha_creacion,
           n.id_lead,
           n.id_oportunidad,
           uo.nombre          AS origen_nombre
      FROM crm_notificacion n
      LEFT JOIN crm_usuario uo ON uo.id_usuario = n.id_usuario_origen
     WHERE n.id_usuario_destino = l_usuario_id
       AND n.leida = 0
     ORDER BY n.tipo DESC, n.fecha_creacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 44. ALERTAS_LOG  (x01=inicio YYYY-MM-DD, x02=fin YYYY-MM-DD)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ALERTAS_LOG
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER;
  l_inicio     DATE := TO_DATE(NULLIF(APEX_APPLICATION.G_X01,''), 'YYYY-MM-DD');
  l_fin        DATE := TO_DATE(NULLIF(APEX_APPLICATION.G_X02,''), 'YYYY-MM-DD');
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  OPEN l_cur FOR
    SELECT n.id_notificacion  AS id,
           n.tipo,
           n.titulo,
           n.mensaje,
           n.leida,
           n.fecha_creacion,
           n.fecha_lectura,
           n.canal,
           n.id_lead,
           n.id_oportunidad
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


-- ─────────────────────────────────────────────────────────────────────────────
-- 45. ALERTAS_MARCAR_LEIDA  (x01 = id_notificacion)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ALERTAS_MARCAR_LEIDA
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_notificacion
     SET leida        = 1,
         fecha_lectura= SYSDATE
   WHERE id_notificacion = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
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
-- 46. EQUIPO_LIST
--     Lista ejecutivos con métricas resumidas del mes actual.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: EQUIPO_LIST
DECLARE
  l_cur  SYS_REFCURSOR;
  l_mes  NUMBER := EXTRACT(MONTH FROM SYSDATE);
  l_anio NUMBER := EXTRACT(YEAR  FROM SYSDATE);
BEGIN
  OPEN l_cur FOR
    SELECT u.id_usuario,
           u.nombre,
           u.email,
           d.nombre                AS departamento,
           (SELECT COUNT(*)
              FROM crm_oportunidad o
              JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
             WHERE o.id_usuario = u.id_usuario AND eo.tipo = 'ABIERTO'
           ) AS oportunidades,
           (SELECT COUNT(*)
              FROM crm_lead l
              JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
             WHERE l.id_usuario = u.id_usuario AND el.tipo = 'ABIERTO'
               AND l.id_oportunidad_generada IS NULL
           ) AS leads,
           (SELECT COUNT(*)
              FROM crm_actividad a
             WHERE a.id_usuario = u.id_usuario
               AND a.fecha_actividad >= TRUNC(SYSDATE, 'MM')
           ) AS actividades_mes,
           NVL((SELECT ROUND(AVG(cm.pct_cumplimiento))
                  FROM crm_cumplimiento_meta cm
                  JOIN crm_meta m ON m.id_meta = cm.id_meta
                 WHERE cm.id_usuario = u.id_usuario
                   AND cm.mes = l_mes AND cm.anio = l_anio), 0) AS cumplimiento
      FROM crm_usuario u
      LEFT JOIN crm_departamento d ON d.id_departamento = u.id_departamento
     WHERE u.rol = 'EJECUTIVO' AND u.activo = 1
     ORDER BY u.nombre;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 47. EQUIPO_GET_EJECUTIVO  (x01 = id_usuario)
--     Perfil completo del ejecutivo con últimas oportunidades y actividades.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: EQUIPO_GET_EJECUTIVO
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_mes  NUMBER := EXTRACT(MONTH FROM SYSDATE);
  l_anio NUMBER := EXTRACT(YEAR  FROM SYSDATE);
BEGIN
  OPEN l_cur FOR
    SELECT u.id_usuario,
           u.nombre,
           u.email,
           u.rol,
           u.ultimo_acceso,
           d.nombre       AS departamento,
           (SELECT NVL(SUM(o.valor_estimado),0)
              FROM crm_oportunidad o
              JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
             WHERE o.id_usuario = l_id AND eo.tipo = 'GANADO'
               AND EXTRACT(MONTH FROM o.fecha_actualizacion) = l_mes
               AND EXTRACT(YEAR  FROM o.fecha_actualizacion) = l_anio
           ) AS ventas_mes,
           (SELECT COUNT(*)
              FROM crm_oportunidad o
              JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
             WHERE o.id_usuario = l_id AND eo.tipo = 'ABIERTO'
           ) AS oportunidades_activas,
           (SELECT COUNT(*)
              FROM crm_actividad a
             WHERE a.id_usuario = l_id
               AND a.fecha_actividad >= TRUNC(SYSDATE) - 30
           ) AS actividades_30d,
           NVL((SELECT ROUND(AVG(cm.pct_cumplimiento))
                  FROM crm_cumplimiento_meta cm
                 WHERE cm.id_usuario = l_id
                   AND cm.mes = l_mes AND cm.anio = l_anio), 0) AS cumplimiento
      FROM crm_usuario u
      LEFT JOIN crm_departamento d ON d.id_departamento = u.id_departamento
     WHERE u.id_usuario = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 48. MONITOREO_EJECUTIVOS
--     Estado de cada ejecutivo: cumplimiento, alertas, actividad reciente.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: MONITOREO_EJECUTIVOS
DECLARE
  l_cur  SYS_REFCURSOR;
  l_mes  NUMBER := EXTRACT(MONTH FROM SYSDATE);
  l_anio NUMBER := EXTRACT(YEAR  FROM SYSDATE);
BEGIN
  OPEN l_cur FOR
    SELECT u.id_usuario                     AS id,
           u.nombre,
           d.nombre                         AS depto,
           NVL((SELECT ROUND(AVG(cm.pct_cumplimiento))
                  FROM crm_cumplimiento_meta cm
                 WHERE cm.id_usuario = u.id_usuario
                   AND cm.mes = l_mes AND cm.anio = l_anio), 0) AS comp,
           (SELECT NVL(SUM(o.valor_estimado),0)
              FROM crm_oportunidad o
              JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
             WHERE o.id_usuario = u.id_usuario AND eo.tipo = 'GANADO'
               AND EXTRACT(MONTH FROM o.fecha_actualizacion) = l_mes
               AND EXTRACT(YEAR  FROM o.fecha_actualizacion) = l_anio
           ) AS ventas,
           (SELECT COUNT(*)
              FROM crm_oportunidad o
              JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
             WHERE o.id_usuario = u.id_usuario AND eo.tipo = 'ABIERTO'
           ) AS opp,
           (SELECT COUNT(*)
              FROM crm_lead l
              JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
             WHERE l.id_usuario = u.id_usuario AND el.tipo = 'ABIERTO'
           ) AS leads,
           (SELECT COUNT(*)
              FROM crm_actividad a
             WHERE a.id_usuario = u.id_usuario
               AND a.fecha_actividad >= TRUNC(SYSDATE) - 30
           ) AS act,
           -- Oportunidades estancadas (>7 días sin actividad)
           (SELECT COUNT(*)
              FROM crm_oportunidad o
              JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
             WHERE o.id_usuario = u.id_usuario AND eo.tipo = 'ABIERTO'
               AND NOT EXISTS (SELECT 1 FROM crm_actividad a
                                WHERE a.id_oportunidad = o.id_oportunidad
                                  AND a.fecha_actividad >= TRUNC(SYSDATE) - 7)
           ) AS estancados,
           -- Días sin actividad de campo
           TRUNC(SYSDATE - NVL(
             (SELECT MAX(a.fecha_actividad)
                FROM crm_actividad a
               WHERE a.id_usuario = u.id_usuario AND a.virtual = 0), SYSDATE - 99)
           ) AS sin_actividad,
           -- Estado semáforo
           CASE
             WHEN NVL((SELECT ROUND(AVG(cm.pct_cumplimiento))
                         FROM crm_cumplimiento_meta cm
                        WHERE cm.id_usuario = u.id_usuario
                          AND cm.mes = l_mes AND cm.anio = l_anio), 0) < 50 THEN 'red'
             WHEN NVL((SELECT ROUND(AVG(cm.pct_cumplimiento))
                         FROM crm_cumplimiento_meta cm
                        WHERE cm.id_usuario = u.id_usuario
                          AND cm.mes = l_mes AND cm.anio = l_anio), 0) < 75 THEN 'yellow'
             ELSE 'green'
           END AS estado
      FROM crm_usuario u
      LEFT JOIN crm_departamento d ON d.id_departamento = u.id_departamento
     WHERE u.rol = 'EJECUTIVO' AND u.activo = 1
     ORDER BY u.nombre;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 49. MONITOREO_ACTIVIDADES_MAPA  (x01 = fecha YYYY-MM-DD, default HOY)
--     Actividades del día con coordenadas GPS para el mapa Leaflet.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: MONITOREO_ACTIVIDADES_MAPA
DECLARE
  l_cur   SYS_REFCURSOR;
  l_fecha DATE := NVL(TO_DATE(NULLIF(APEX_APPLICATION.G_X01,''), 'YYYY-MM-DD'), TRUNC(SYSDATE));
BEGIN
  OPEN l_cur FOR
    SELECT a.id_actividad            AS id,
           a.tipo,
           a.asunto                  AS titulo,
           a.resultado,
           a.virtual,
           TO_CHAR(a.fecha_actividad, 'HH24:MI') AS hora,
           u.nombre                  AS ejecutivo,
           m.nombre                  AS ciudad,
           ub.latitud,
           ub.longitud,
           o.titulo                  AS oportunidad,
           CASE
             WHEN a.resultado IS NOT NULL THEN 'completada'
             WHEN a.fecha_actividad < SYSDATE THEN 'vencida'
             ELSE 'programada'
           END AS estado
      FROM crm_actividad a
      JOIN crm_usuario u         ON u.id_usuario    = a.id_usuario
      LEFT JOIN crm_oportunidad o ON o.id_oportunidad= a.id_oportunidad
      LEFT JOIN crm_empresa e    ON e.id_empresa     = o.id_empresa
      LEFT JOIN crm_municipio m  ON m.id_municipio   = e.id_municipio
      LEFT JOIN crm_ubicacion ub ON ub.id_actividad  = a.id_actividad
     WHERE TRUNC(a.fecha_actividad) = l_fecha
       AND a.virtual = 0               -- solo presenciales tienen GPS relevante
     ORDER BY a.fecha_actividad;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 50. ANALISIS_SECTORES  (x01 = periodo YYYY-MM, default mes actual)
--     Ingresos, pipeline y conversión por sector.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ANALISIS_SECTORES
DECLARE
  l_cur   SYS_REFCURSOR;
  l_mes   NUMBER;
  l_anio  NUMBER;
  l_per   VARCHAR2(7) := NULLIF(APEX_APPLICATION.G_X01,'');
BEGIN
  l_mes  := NVL(TO_NUMBER(SUBSTR(l_per,6,2)), EXTRACT(MONTH FROM SYSDATE));
  l_anio := NVL(TO_NUMBER(SUBSTR(l_per,1,4)), EXTRACT(YEAR  FROM SYSDATE));

  OPEN l_cur FOR
    SELECT s.id_sector,
           s.nombre                                        AS sector,
           s.color_hex,
           COUNT(o.id_oportunidad)                         AS opp_activas,
           NVL(SUM(o.valor_estimado), 0)                   AS pipeline,
           NVL(SUM(CASE WHEN eo.tipo = 'GANADO'
                        AND EXTRACT(MONTH FROM o.fecha_actualizacion) = l_mes
                        AND EXTRACT(YEAR  FROM o.fecha_actualizacion) = l_anio
                   THEN o.valor_estimado ELSE 0 END), 0)   AS ventas_mes,
           COUNT(CASE WHEN eo.tipo = 'GANADO'
                      AND EXTRACT(MONTH FROM o.fecha_actualizacion) = l_mes
                      AND EXTRACT(YEAR  FROM o.fecha_actualizacion) = l_anio
                 THEN 1 END)                                AS ganadas_mes,
           COUNT(CASE WHEN eo.tipo = 'PERDIDO'
                      AND EXTRACT(MONTH FROM o.fecha_actualizacion) = l_mes
                      AND EXTRACT(YEAR  FROM o.fecha_actualizacion) = l_anio
                 THEN 1 END)                                AS perdidas_mes,
           CASE WHEN COUNT(o.id_oportunidad) > 0
                THEN ROUND(100 * COUNT(CASE WHEN eo.tipo='GANADO' THEN 1 END)
                           / COUNT(o.id_oportunidad))
                ELSE 0 END                                  AS tasa_conversion
      FROM crm_sector s
      LEFT JOIN crm_oportunidad o ON o.id_sector = s.id_sector
      LEFT JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
     GROUP BY s.id_sector, s.nombre, s.color_hex
     ORDER BY pipeline DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 51. ANALISIS_FORECAST  (x01 = meses_proyeccion, default 6)
--     Proyección de cierre basada en pipeline actual y tasas históricas.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: ANALISIS_FORECAST
DECLARE
  l_cur    SYS_REFCURSOR;
  l_meses  NUMBER := NVL(TO_NUMBER(NULLIF(APEX_APPLICATION.G_X01,'')), 6);
BEGIN
  OPEN l_cur FOR
    SELECT
      TO_CHAR(ADD_MONTHS(TRUNC(SYSDATE,'MM'), lvl-1), 'YYYY-MM') AS mes,
      -- Pipeline que cierra en ese mes según fecha_cierre_estimada
      NVL((SELECT SUM(o.valor_estimado * NVL(o.probabilidad_cierre,50) / 100)
             FROM crm_oportunidad o
             JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
            WHERE eo.tipo = 'ABIERTO'
              AND EXTRACT(MONTH FROM o.fecha_cierre_estimada)
                  = EXTRACT(MONTH FROM ADD_MONTHS(TRUNC(SYSDATE,'MM'), lvl-1))
              AND EXTRACT(YEAR FROM o.fecha_cierre_estimada)
                  = EXTRACT(YEAR FROM ADD_MONTHS(TRUNC(SYSDATE,'MM'), lvl-1))
          ), 0) AS esperada,
      -- Optimista: probabilidad_cierre * 1.2
      NVL((SELECT SUM(o.valor_estimado * LEAST(NVL(o.probabilidad_cierre,50)*1.2,100) / 100)
             FROM crm_oportunidad o
             JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
            WHERE eo.tipo = 'ABIERTO'
              AND EXTRACT(MONTH FROM o.fecha_cierre_estimada)
                  = EXTRACT(MONTH FROM ADD_MONTHS(TRUNC(SYSDATE,'MM'), lvl-1))
              AND EXTRACT(YEAR FROM o.fecha_cierre_estimada)
                  = EXTRACT(YEAR FROM ADD_MONTHS(TRUNC(SYSDATE,'MM'), lvl-1))
          ), 0) AS optimista,
      -- Pesimista: probabilidad_cierre * 0.6
      NVL((SELECT SUM(o.valor_estimado * NVL(o.probabilidad_cierre,50)*0.6 / 100)
             FROM crm_oportunidad o
             JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
            WHERE eo.tipo = 'ABIERTO'
              AND EXTRACT(MONTH FROM o.fecha_cierre_estimada)
                  = EXTRACT(MONTH FROM ADD_MONTHS(TRUNC(SYSDATE,'MM'), lvl-1))
              AND EXTRACT(YEAR FROM o.fecha_cierre_estimada)
                  = EXTRACT(YEAR FROM ADD_MONTHS(TRUNC(SYSDATE,'MM'), lvl-1))
          ), 0) AS pesimista,
      -- Real del mes (si ya pasó)
      CASE WHEN ADD_MONTHS(TRUNC(SYSDATE,'MM'), lvl-1) <= TRUNC(SYSDATE,'MM') THEN
        NVL((SELECT SUM(o.valor_estimado)
               FROM crm_oportunidad o
               JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
              WHERE eo.tipo = 'GANADO'
                AND EXTRACT(MONTH FROM o.fecha_actualizacion)
                    = EXTRACT(MONTH FROM ADD_MONTHS(TRUNC(SYSDATE,'MM'), lvl-1))
                AND EXTRACT(YEAR FROM o.fecha_actualizacion)
                    = EXTRACT(YEAR FROM ADD_MONTHS(TRUNC(SYSDATE,'MM'), lvl-1))
            ), 0)
      ELSE NULL END AS real
    FROM (SELECT LEVEL AS lvl FROM DUAL CONNECT BY LEVEL <= l_meses)
    ORDER BY lvl;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 52. REPORTES_LIST
--     Lista estática de reportes disponibles (no requiere tabla).
--     Extensible: reemplazar con tabla CRM_REPORTE si se necesita configuración.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: REPORTES_LIST
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT 1 AS id, 'Pipeline Ejecutivo'         AS titulo, 'Detalle de oportunidades activas por etapa'          AS descripcion, 'PIPELINE'       AS cat FROM DUAL UNION ALL
    SELECT 2,       'Cumplimiento de Metas',        'Avance vs meta por ejecutivo y período',                        'METAS'          FROM DUAL UNION ALL
    SELECT 3,       'Actividades de Campo',          'Registro de visitas, llamadas y reuniones por ejecutivo',        'ACTIVIDADES'    FROM DUAL UNION ALL
    SELECT 4,       'Análisis de Sectores',          'Distribución de ventas y pipeline por sector industrial',        'ANALISIS'       FROM DUAL UNION ALL
    SELECT 5,       'Forecast de Ventas',            'Proyección de ingresos basada en probabilidad de cierre',        'FORECAST'       FROM DUAL UNION ALL
    SELECT 6,       'Leads por Origen',              'Efectividad de cada canal de captación de prospectos',           'LEADS'          FROM DUAL UNION ALL
    SELECT 7,       'Clientes Nuevos',               'Empresas nuevas cerradas en el período',                         'CLIENTES'       FROM DUAL UNION ALL
    SELECT 8,       'Proyectos en Ejecución',        'Estado y avance de proyectos post-venta',                        'PROYECTOS'      FROM DUAL UNION ALL
    SELECT 9,       'Alertas y Estancados',          'Oportunidades sin actividad reciente por ejecutivo',              'ALERTAS'        FROM DUAL
    ORDER BY id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 53. REPORTES_GENERAR  (x01=tipo, x02=inicio YYYY-MM-DD, x03=fin YYYY-MM-DD)
--     Genera los datos del reporte solicitado en el rango de fechas.
--     El frontend renderiza los datos; la descarga PDF es manejada por APEX.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: REPORTES_GENERAR
DECLARE
  l_cur    SYS_REFCURSOR;
  l_tipo   VARCHAR2(30) := UPPER(APEX_APPLICATION.G_X01);
  l_inicio DATE := TO_DATE(NULLIF(APEX_APPLICATION.G_X02,''), 'YYYY-MM-DD');
  l_fin    DATE := TO_DATE(NULLIF(APEX_APPLICATION.G_X03,''), 'YYYY-MM-DD');
BEGIN
  -- Cada tipo devuelve la consulta apropiada.
  -- El frontend recibe el array y lo renderiza en tabla/gráfico.
  IF l_tipo = 'PIPELINE' THEN
    OPEN l_cur FOR
      SELECT o.titulo, eo.nombre AS estado, o.valor_estimado,
             o.fecha_cierre_estimada, u.nombre AS ejecutivo, e.nombre AS empresa
        FROM crm_oportunidad o
        JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
        JOIN crm_usuario u             ON u.id_usuario = o.id_usuario
        LEFT JOIN crm_empresa e        ON e.id_empresa = o.id_empresa
       WHERE eo.tipo = 'ABIERTO'
         AND (l_inicio IS NULL OR o.fecha_creacion >= l_inicio)
         AND (l_fin    IS NULL OR o.fecha_creacion <= l_fin)
       ORDER BY eo.orden, o.valor_estimado DESC;

  ELSIF l_tipo = 'ACTIVIDADES' THEN
    OPEN l_cur FOR
      SELECT a.tipo, a.asunto, a.fecha_actividad, a.resultado,
             u.nombre AS ejecutivo, o.titulo AS oportunidad
        FROM crm_actividad a
        JOIN crm_usuario u          ON u.id_usuario    = a.id_usuario
        LEFT JOIN crm_oportunidad o ON o.id_oportunidad= a.id_oportunidad
       WHERE (l_inicio IS NULL OR TRUNC(a.fecha_actividad) >= l_inicio)
         AND (l_fin    IS NULL OR TRUNC(a.fecha_actividad) <= l_fin)
       ORDER BY a.fecha_actividad DESC;

  ELSIF l_tipo = 'LEADS' THEN
    OPEN l_cur FOR
      SELECT l.titulo, l.nombre_empresa, el.nombre AS estado,
             ol.nombre AS origen, u.nombre AS ejecutivo, l.fecha_creacion
        FROM crm_lead l
        JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
        JOIN crm_origen_lead ol ON ol.id_origen_lead = l.id_origen_lead
        JOIN crm_usuario u      ON u.id_usuario      = l.id_usuario
       WHERE (l_inicio IS NULL OR TRUNC(l.fecha_creacion) >= l_inicio)
         AND (l_fin    IS NULL OR TRUNC(l.fecha_creacion) <= l_fin)
       ORDER BY l.fecha_creacion DESC;

  ELSE
    -- Tipo no reconocido: devolver vacío con mensaje
    OPEN l_cur FOR SELECT 'tipo_no_soportado' AS error FROM DUAL WHERE 1=0;
  END IF;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.WRITE('tipo', l_tipo);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 54. CONFIGURACION_GET
--     Variables de sistema: días de alerta, montos mínimos, etc.
--     Consumido por coordinadorAPI.variablesSistema().
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: CONFIGURACION_GET
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT clave,
           valor,
           unidad,
           descripcion
      FROM crm_configuracion_sistema
     ORDER BY clave;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- =============================================================================
-- FIN DEL SCRIPT
-- Total: 54 Application Processes (49 del plan + 5 adicionales detectados)
--
-- Procesos adicionales respecto al plan original:
--   ACTIVIDADES_LIST_MIS    (22) — misActividades() del ejecutivo
--   ACTIVIDADES_LIST_TODAS  (23) — actividades() del director
--   MONITOREO_EJECUTIVOS    (48) — MonitoreoPage tabla (≠ GPS)
--   REPORTES_GENERAR        (53) — generar datos del reporte
--   CONFIGURACION_GET       (54) — variablesSistema() coordinador
--
-- Secuencias requeridas (crear antes de ejecutar cualquier proceso CREATE):
--   crm_empresa_seq, crm_contacto_seq, crm_email_seq, crm_telefono_seq,
--   crm_lead_seq, crm_hist_lead_seq, crm_oportunidad_seq, crm_hist_opp_seq,
--   crm_actividad_seq, crm_ubicacion_seq, crm_proyecto_seq,
--   crm_usuario_seq
-- =============================================================================
