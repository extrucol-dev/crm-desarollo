-- ============================================================
-- CRM EXTRUCOL - APPLICATION PROCESSES
-- Procesos APEX para CRM_OPOR_API
-- ============================================================

-- OPORTUNIDADES_LIST: Oportunidades del ejecutivo
DECLARE
  l_cur     SYS_REFCURSOR;
  l_ejec_id VARCHAR2(50) := APEX_APPLICATION.G_X01;
BEGIN
  OPEN l_cur FOR
    SELECT o.id, o.nombre, o.descripcion, o.tipo, o.estado,
           o.valor_estimado, o.fecha_cierre,
           o.cliente_id, c.empresa AS cliente_nombre,
           o.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           o.motivo_cierre, o.fecha_estado, o.activo, o.fecha_creacion
      FROM crm_oportunidades o
      LEFT JOIN crm_clientes c ON c.id = o.cliente_id
      JOIN crm_usuarios u ON u.id = o.ejecutivo_id
     WHERE o.activo = 1
       AND (l_ejec_id IS NULL OR o.ejecutivo_id = TO_NUMBER(l_ejec_id))
     ORDER BY o.fecha_creacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- OPORTUNIDADES_LIST_TODAS: Todas las oportunidades (director)
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT o.id, o.nombre, o.descripcion, o.tipo, o.estado,
           o.valor_estimado, o.fecha_cierre,
           o.cliente_id, c.empresa AS cliente_nombre,
           o.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           o.motivo_cierre, o.fecha_estado, o.activo, o.fecha_creacion
      FROM crm_oportunidades o
      LEFT JOIN crm_clientes c ON c.id = o.cliente_id
      JOIN crm_usuarios u ON u.id = o.ejecutivo_id
     WHERE o.activo = 1
     ORDER BY o.fecha_creacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- OPORTUNIDADES_GET: Detalle de oportunidad por ID
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT o.id, o.nombre, o.descripcion, o.tipo, o.estado,
           o.valor_estimado, o.fecha_cierre,
           o.cliente_id, c.empresa AS cliente_nombre, c.nombre AS contacto_nombre,
           o.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           o.motivo_cierre, o.fecha_estado, o.activo, o.fecha_creacion, o.fecha_update
      FROM crm_oportunidades o
      LEFT JOIN crm_clientes c ON c.id = o.cliente_id
      JOIN crm_usuarios u ON u.id = o.ejecutivo_id
     WHERE o.id = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- OPORTUNIDADES_ACTIVIDADES: Actividades de una oportunidad
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT a.id, a.tipo, a.descripcion, a.resultado, a.virtual,
           a.fecha_actividad,
           a.oportunidad_id, a.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           a.latitud, a.longitud, a.activo, a.fecha_creacion
      FROM crm_actividades a
      JOIN crm_usuarios u ON u.id = a.ejecutivo_id
     WHERE a.oportunidad_id = l_id AND a.activo = 1
     ORDER BY a.fecha_actividad DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- OPORTUNIDADES_CREATE: Crea nueva oportunidad
DECLARE
  l_id NUMBER;
BEGIN
  INSERT INTO crm_oportunidades (nombre, descripcion, tipo, valor_estimado, fecha_cierre, cliente_id, ejecutivo_id)
  VALUES (
    APEX_APPLICATION.G_X01,
    APEX_APPLICATION.G_X02,
    APEX_APPLICATION.G_X03,
    TO_NUMBER(APEX_APPLICATION.G_X04),
    TO_DATE(APEX_APPLICATION.G_X05,'YYYY-MM-DD'),
    NVL(TO_NUMBER(APEX_APPLICATION.G_X06), NULL),
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

-- OPORTUNIDADES_UPDATE: Actualiza oportunidad
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_oportunidades
     SET nombre         = APEX_APPLICATION.G_X02,
         descripcion   = APEX_APPLICATION.G_X03,
         tipo          = APEX_APPLICATION.G_X04,
         estado        = APEX_APPLICATION.G_X05,
         valor_estimado = TO_NUMBER(NVL(APEX_APPLICATION.G_X06, '0')),
         fecha_cierre  = TO_DATE(APEX_APPLICATION.G_X07,'YYYY-MM-DD'),
         cliente_id    = NVL(TO_NUMBER(APEX_APPLICATION.G_X08), cliente_id)
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

-- OPORTUNIDADES_AVANZAR: Avanza estado de oportunidad
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_oportunidades
     SET estado = APEX_APPLICATION.G_X02, fecha_estado = SYSDATE
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

-- OPORTUNIDADES_CERRAR: Cierra oportunidad (GANADA o PERDIDA)
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_oportunidades
     SET estado = APEX_APPLICATION.G_X02,
         fecha_cierre = TO_DATE(APEX_APPLICATION.G_X03,'YYYY-MM-DD'),
         motivo_cierre = APEX_APPLICATION.G_X04,
         fecha_estado = SYSDATE
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

-- OPORTUNIDADES_ESTANCADAS: Oportunidades sin actividad reciente
DECLARE
  l_cur  SYS_REFCURSOR;
  l_dias NUMBER := NVL(TO_NUMBER(APEX_APPLICATION.G_X01), 7);
BEGIN
  OPEN l_cur FOR
    SELECT o.id, o.nombre, o.estado, o.valor_estimado, o.fecha_cierre,
           TRUNC(SYSDATE - MAX(a.fecha_actividad)) AS dias_inactivo,
           o.ejecutivo_id, u.nombre AS ejecutivo_nombre
      FROM crm_oportunidades o
      JOIN crm_usuarios u ON u.id = o.ejecutivo_id
      LEFT JOIN crm_actividades a ON a.oportunidad_id = o.id
     WHERE o.estado NOT IN ('GANADA','PERDIDA')
       AND o.activo = 1
     GROUP BY o.id, o.nombre, o.estado, o.valor_estimado, o.fecha_cierre, o.ejecutivo_id, u.nombre
    HAVING TRUNC(SYSDATE - MAX(a.fecha_actividad)) > l_dias
     ORDER BY dias_inactivo DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;