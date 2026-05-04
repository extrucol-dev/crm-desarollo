-- ============================================================
-- CRM EXTRUCOL - APPLICATION PROCESSES
-- Procesos APEX para CRM_CLIENTES_API
-- ============================================================

-- CLIENTES_LIST: Lista clientes del ejecutivo
DECLARE
  l_cur     SYS_REFCURSOR;
  l_ejec_id VARCHAR2(50) := APEX_APPLICATION.G_X01;
BEGIN
  OPEN l_cur FOR
    SELECT c.id, c.nombre, c.empresa, c.sector, c.email, c.telefono,
           c.ciudad_id, cu.nombre AS ciudad_nombre,
           c.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           c.activo, c.fecha_creacion
      FROM crm_clientes c
      JOIN crm_usuarios u ON u.id = c.ejecutivo_id
      LEFT JOIN crm_ciudades cu ON cu.id = c.ciudad_id
     WHERE c.activo = 1
       AND (l_ejec_id IS NULL OR c.ejecutivo_id = TO_NUMBER(l_ejec_id))
     ORDER BY c.empresa;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- CLIENTES_GET: Obtiene un cliente por ID
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT c.id, c.nombre, c.empresa, c.sector, c.email, c.telefono,
           c.ciudad_id, cu.nombre AS ciudad_nombre,
           c.direccion, c.notas,
           c.ejecutivo_id, u.nombre AS ejecutivo_nombre,
           c.activo, c.fecha_creacion, c.fecha_update
      FROM crm_clientes c
      JOIN crm_usuarios u ON u.id = c.ejecutivo_id
      LEFT JOIN crm_ciudades cu ON cu.id = c.ciudad_id
     WHERE c.id = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- CLIENTES_CREATE: Crea un nuevo cliente
DECLARE
  l_id NUMBER;
BEGIN
  INSERT INTO crm_clientes (nombre, empresa, sector, email, telefono, ciudad_id, direccion, ejecutivo_id)
  VALUES (
    APEX_APPLICATION.G_X01,
    APEX_APPLICATION.G_X02,
    APEX_APPLICATION.G_X03,
    APEX_APPLICATION.G_X04,
    APEX_APPLICATION.G_X05,
    NVL(TO_NUMBER(APEX_APPLICATION.G_X06), NULL),
    APEX_APPLICATION.G_X07,
    NVL(TO_NUMBER(APEX_APPLICATION.G_X08), NULL)
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

-- CLIENTES_UPDATE: Actualiza un cliente
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_clientes
     SET nombre      = APEX_APPLICATION.G_X02,
         empresa     = APEX_APPLICATION.G_X03,
         sector      = APEX_APPLICATION.G_X04,
         email       = APEX_APPLICATION.G_X05,
         telefono    = APEX_APPLICATION.G_X06,
         ciudad_id   = NVL(TO_NUMBER(APEX_APPLICATION.G_X07), ciudad_id),
         direccion   = APEX_APPLICATION.G_X08,
         ejecutivo_id = NVL(TO_NUMBER(APEX_APPLICATION.G_X09), ejecutivo_id)
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