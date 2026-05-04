-- ============================================================
-- CRM EXTRUCOL - APPLICATION PROCESSES
-- Procesos APEX para CRM_ACTIVIDADES_API
-- ============================================================

-- ACTIVIDADES_CREATE
DECLARE
  l_id NUMBER;
BEGIN
  INSERT INTO crm_actividades (tipo, descripcion, virtual, fecha_actividad, oportunidad_id, ejecutivo_id)
  VALUES (
    APEX_APPLICATION.G_X01,
    APEX_APPLICATION.G_X02,
    TO_NUMBER(APEX_APPLICATION.G_X03),
    TO_DATE(APEX_APPLICATION.G_X04,'YYYY-MM-DD'),
    NVL(TO_NUMBER(APEX_APPLICATION.G_X05), NULL),
    3
  )
  RETURNING id INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id', l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;

-- ACTIVIDADES_GET
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT a.id, a.tipo, a.descripcion, a.resultado, a.virtual,
           a.fecha_actividad, a.fecha_registro,
           a.oportunidad_id, o.nombre AS oportunidad_nombre,
           a.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           a.latitud, a.longitud, a.activo, a.fecha_creacion, a.fecha_update
      FROM crm_actividades a
      LEFT JOIN crm_oportunidades o ON o.id = a.oportunidad_id
      JOIN crm_usuarios u ON u.id = a.ejecutivo_id
     WHERE a.id = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- ACTIVIDADES_UPDATE
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_actividades
     SET tipo            = APEX_APPLICATION.G_X02,
         descripcion    = APEX_APPLICATION.G_X03,
         virtual        = TO_NUMBER(APEX_APPLICATION.G_X04),
         fecha_actividad = TO_DATE(APEX_APPLICATION.G_X05,'YYYY-MM-DD')
   WHERE id = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;

-- ACTIVIDADES_CERRAR
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_actividades
     SET resultado = APEX_APPLICATION.G_X02,
         latitud  = NVL(TO_NUMBER(APEX_APPLICATION.G_X03), latitud),
         longitud = NVL(TO_NUMBER(APEX_APPLICATION.G_X04), longitud)
   WHERE id = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION
  WHEN OTHERS THEN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error', SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;

-- ACTIVIDADES_LIST_TODAS
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT a.id, a.tipo, a.descripcion, a.resultado, a.virtual,
           a.fecha_actividad,
           a.oportunidad_id, o.nombre AS oportunidad_nombre,
           a.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           a.latitud, a.longitud, a.activo, a.fecha_creacion
      FROM crm_actividades a
      LEFT JOIN crm_oportunidades o ON o.id = a.oportunidad_id
      JOIN crm_usuarios u ON u.id = a.ejecutivo_id
     WHERE a.activo = 1
       AND (APEX_APPLICATION.G_X01 IS NULL OR a.fecha_actividad >= TO_DATE(APEX_APPLICATION.G_X01,'YYYY-MM-DD'))
       AND (APEX_APPLICATION.G_X02 IS NULL OR a.fecha_actividad <= TO_DATE(APEX_APPLICATION.G_X02,'YYYY-MM-DD'))
     ORDER BY a.fecha_actividad DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- ACTIVIDADES_LIST_MIS
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT a.id, a.tipo, a.descripcion, a.resultado, a.virtual,
           a.fecha_actividad,
           a.oportunidad_id, o.nombre AS oportunidad_nombre,
           a.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           a.latitud, a.longitud, a.activo, a.fecha_creacion
      FROM crm_actividades a
      LEFT JOIN crm_oportunidades o ON o.id = a.oportunidad_id
      JOIN crm_usuarios u ON u.id = a.ejecutivo_id
     WHERE a.ejecutivo_id = 3
       AND a.activo = 1
       AND (APEX_APPLICATION.G_X01 IS NULL OR a.fecha_actividad >= TO_DATE(APEX_APPLICATION.G_X01,'YYYY-MM-DD'))
       AND (APEX_APPLICATION.G_X02 IS NULL OR a.fecha_actividad <= TO_DATE(APEX_APPLICATION.G_X02,'YYYY-MM-DD'))
     ORDER BY a.fecha_actividad DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;