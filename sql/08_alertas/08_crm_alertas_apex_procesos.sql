-- ============================================================
-- CRM EXTRUCOL - APPLICATION PROCESSES para ALERTAS
-- ============================================================

-- ALERTAS_LIST
DECLARE l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT id, titulo, mensaje, tipo, usuario_id, estado, fecha_alerta
      FROM crm_alertas
     WHERE usuario_id = 3 AND activo = 1 AND estado != 'ELIMINADA'
     ORDER BY fecha_alerta DESC;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;

-- ALERTAS_LOG
DECLARE l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT a.id, a.titulo, a.mensaje, a.tipo, a.usuario_id, u.nombre AS usuario_nombre,
           a.estado, a.fecha_alerta
      FROM crm_alertas a JOIN crm_usuarios u ON u.id = a.usuario_id
     WHERE a.activo = 1
       AND (APEX_APPLICATION.G_X01 IS NULL OR a.fecha_alerta >= TO_DATE(APEX_APPLICATION.G_X01,'YYYY-MM-DD'))
       AND (APEX_APPLICATION.G_X02 IS NULL OR a.fecha_alerta <= TO_DATE(APEX_APPLICATION.G_X02,'YYYY-MM-DD'))
     ORDER BY a.fecha_alerta DESC;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;

-- ALERTAS_MARCAR_LEIDA
DECLARE l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_alertas SET estado = 'LEIDA' WHERE id = l_id;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM); APEX_JSON.CLOSE_OBJECT;
END;