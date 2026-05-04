-- ============================================================
-- CRM EXTRUCOL - APPLICATION PROCESSES para PROYECTOS
-- ============================================================

-- PROYECTOS_LIST
DECLARE l_cur SYS_REFCURSOR; l_ejec VARCHAR2(50) := APEX_APPLICATION.G_X01;
BEGIN
  OPEN l_cur FOR
    SELECT p.id, p.nombre, p.descripcion, p.estado,
           p.oportunidad_id, o.nombre AS oportunidad_nombre,
           p.fecha_inicio, p.fecha_fin, p.activo, p.fecha_creacion
      FROM crm_proyectos p
      LEFT JOIN crm_oportunidades o ON o.id = p.oportunidad_id
     WHERE p.activo = 1
       AND (l_ejec IS NULL OR o.ejecutivo_id = TO_NUMBER(l_ejec))
     ORDER BY p.fecha_creacion DESC;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;

-- PROYECTOS_LIST_TODAS
DECLARE l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT p.id, p.nombre, p.descripcion, p.estado,
           p.oportunidad_id, o.nombre AS oportunidad_nombre,
           p.fecha_inicio, p.fecha_fin, p.activo, p.fecha_creacion
      FROM crm_proyectos p
      LEFT JOIN crm_oportunidades o ON o.id = p.oportunidad_id
     WHERE p.activo = 1 ORDER BY p.fecha_creacion DESC;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;

-- PROYECTOS_GET
DECLARE l_cur SYS_REFCURSOR; l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT p.id, p.nombre, p.descripcion, p.estado,
           p.oportunidad_id, o.nombre AS oportunidad_nombre,
           p.fecha_inicio, p.fecha_fin, p.activo, p.fecha_creacion, p.fecha_update
      FROM crm_proyectos p LEFT JOIN crm_oportunidades o ON o.id = p.oportunidad_id
     WHERE p.id = l_id;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;

-- PROYECTOS_CREATE
DECLARE l_id NUMBER;
BEGIN
  INSERT INTO crm_proyectos (nombre, descripcion, oportunidad_id, fecha_inicio)
  VALUES (APEX_APPLICATION.G_X01, APEX_APPLICATION.G_X02, NVL(TO_NUMBER(APEX_APPLICATION.G_X03), NULL), SYSDATE)
  RETURNING id INTO l_id;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('id', l_id); APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM); APEX_JSON.CLOSE_OBJECT;
END;

-- PROYECTOS_UPDATE
DECLARE l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_proyectos SET nombre = APEX_APPLICATION.G_X02, descripcion = APEX_APPLICATION.G_X03,
    estado = APEX_APPLICATION.G_X04, oportunidad_id = NVL(TO_NUMBER(APEX_APPLICATION.G_X05), oportunidad_id)
   WHERE id = l_id;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM); APEX_JSON.CLOSE_OBJECT;
END;

-- PROYECTOS_ESTADO
DECLARE l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_proyectos SET estado = APEX_APPLICATION.G_X02 WHERE id = l_id;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM); APEX_JSON.CLOSE_OBJECT;
END;