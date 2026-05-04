-- ============================================================
-- CRM EXTRUCOL - APPLICATION PROCESSES
-- Procesos APEX para CRM_USUARIOS_API
-- ============================================================

-- USUARIOS_LIST: Lista todos los usuarios o filtra por rol
DECLARE
  l_cur    SYS_REFCURSOR;
  l_rol    VARCHAR2(30) := NVL(APEX_APPLICATION.G_X01, 'EJECUTIVO');
BEGIN
  OPEN l_cur FOR
    SELECT u.id, u.nombre, u.email, u.rol, u.telefono,
           u.ciudad_id, c.nombre AS ciudad_nombre,
           u.activo, u.fecha_creacion
      FROM crm_usuarios u
      LEFT JOIN crm_ciudades c ON c.id = u.ciudad_id
     WHERE u.activo = 1
       AND (l_rol IS NULL OR UPPER(u.rol) = UPPER(l_rol))
     ORDER BY u.nombre;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- USUARIOS_GET: Obtiene un usuario por ID
DECLARE
  l_cur  SYS_REFCURSOR;
  l_id   NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT u.id, u.nombre, u.email, u.rol, u.telefono,
           u.ciudad_id, c.nombre AS ciudad_nombre,
           u.activo, u.fecha_creacion, u.fecha_update
      FROM crm_usuarios u
      LEFT JOIN crm_ciudades c ON c.id = u.ciudad_id
     WHERE u.id = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;

-- USUARIOS_CREATE: Crea un nuevo usuario
DECLARE
  l_id NUMBER;
BEGIN
  INSERT INTO crm_usuarios (nombre, email, rol, ciudad_id, telefono)
  VALUES (
    APEX_APPLICATION.G_X01,
    APEX_APPLICATION.G_X02,
    APEX_APPLICATION.G_X03,
    NVL(TO_NUMBER(APEX_APPLICATION.G_X04), NULL),
    APEX_APPLICATION.G_X05
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

-- USUARIOS_UPDATE: Actualiza un usuario existente
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_usuarios
     SET nombre    = APEX_APPLICATION.G_X02,
         email     = APEX_APPLICATION.G_X03,
         rol       = APEX_APPLICATION.G_X04,
         ciudad_id = NVL(TO_NUMBER(APEX_APPLICATION.G_X05), ciudad_id),
         telefono  = APEX_APPLICATION.G_X06
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

-- USUARIOS_ESTADO: Activa/inactiva un usuario (1=activo, 0=inactivo)
DECLARE
  l_id    NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_act   NUMBER := CASE WHEN APEX_APPLICATION.G_X02 = '1' THEN 1 WHEN APEX_APPLICATION.G_X02 = '0' THEN 0 ELSE 1 END;
BEGIN
  UPDATE crm_usuarios SET activo = l_act WHERE id = l_id;

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