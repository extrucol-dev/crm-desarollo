-- ============================================================
-- CRM EXTRUCOL - APPLICATION PROCESSES
-- Procesos APEX para CRM_LEADS_API
-- ============================================================

-- LEADS_LIST: Lista leads del ejecutivo
DECLARE
  l_cur     SYS_REFCURSOR;
  l_ejec_id VARCHAR2(50) := APEX_APPLICATION.G_X01;
BEGIN
  OPEN l_cur FOR
    SELECT l.id, l.nombre, l.empresa, l.email, l.telefono,
           l.origen, l.sector, l.estado,
           l.ciudad_id, c.nombre AS ciudad_nombre,
           l.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           l.descripcion, l.activo, l.fecha_creacion
      FROM crm_leads l
      JOIN crm_usuarios u ON u.id = l.ejecutivo_id
      LEFT JOIN crm_ciudades c ON c.id = l.ciudad_id
     WHERE l.activo = 1
       AND (l_ejec_id IS NULL OR l.ejecutivo_id = TO_NUMBER(l_ejec_id))
     ORDER BY l.fecha_creacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- LEADS_GET: Obtiene un lead por ID
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT l.id, l.nombre, l.empresa, l.email, l.telefono,
           l.origen, l.sector, l.estado,
           l.ciudad_id, c.nombre AS ciudad_nombre,
           l.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           l.descripcion, l.activo, l.fecha_creacion, l.fecha_update
      FROM crm_leads l
      JOIN crm_usuarios u ON u.id = l.ejecutivo_id
      LEFT JOIN crm_ciudades c ON c.id = l.ciudad_id
     WHERE l.id = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- LEADS_CREATE: Crea un nuevo lead
DECLARE
  l_id NUMBER;
BEGIN
  INSERT INTO crm_leads (nombre, empresa, email, telefono, origen, sector, ciudad_id, descripcion, ejecutivo_id)
  VALUES (
    APEX_APPLICATION.G_X01,
    APEX_APPLICATION.G_X02,
    APEX_APPLICATION.G_X03,
    APEX_APPLICATION.G_X04,
    APEX_APPLICATION.G_X05,
    APEX_APPLICATION.G_X06,
    NVL(TO_NUMBER(APEX_APPLICATION.G_X07), NULL),
    APEX_APPLICATION.G_X08,
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

-- LEADS_UPDATE: Actualiza un lead
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_leads
     SET nombre     = APEX_APPLICATION.G_X02,
         empresa    = APEX_APPLICATION.G_X03,
         email      = APEX_APPLICATION.G_X04,
         telefono   = APEX_APPLICATION.G_X05,
         origen     = APEX_APPLICATION.G_X06,
         sector     = APEX_APPLICATION.G_X07,
         ciudad_id  = NVL(TO_NUMBER(APEX_APPLICATION.G_X08), ciudad_id),
         descripcion = APEX_APPLICATION.G_X09
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

-- LEADS_ESTADO: Cambia el estado de un lead
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_leads SET estado = APEX_APPLICATION.G_X02 WHERE id = l_id;

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

-- LEADS_CONVERTIR: Convierte un lead en oportunidad
DECLARE
  l_id       NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_opp_id   NUMBER;
  l_ejec_id  NUMBER;
BEGIN
  SELECT ejecutivo_id INTO l_ejec_id FROM crm_leads WHERE id = l_id;

  INSERT INTO crm_oportunidades (nombre, descripcion, tipo, valor_estimado, fecha_cierre, estado, ejecutivo_id)
  VALUES (
    APEX_APPLICATION.G_X02,
    'Convertido desde lead',
    'VENTA',
    TO_NUMBER(APEX_APPLICATION.G_X03),
    TO_DATE(APEX_APPLICATION.G_X04,'YYYY-MM-DD'),
    'PROSPECTO',
    l_ejec_id
  )
  RETURNING id INTO l_opp_id;

  UPDATE crm_leads SET estado = 'CONVERTIDO', activo = 0 WHERE id = l_id;
  COMMIT;

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