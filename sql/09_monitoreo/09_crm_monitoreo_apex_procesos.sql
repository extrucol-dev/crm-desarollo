-- ============================================================
-- CRM EXTRUCOL - APPLICATION PROCESSES para MONITOREO
-- ============================================================

-- MONITOREO_EJECUTIVOS_GPS
DECLARE l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT u.id, u.nombre, ub.latitud, ub.longitud, ub.precision, ub.fecha_registro
      FROM crm_usuarios u
      JOIN (SELECT usuario_id, latitud, longitud, precision, fecha_registro,
                  ROW_NUMBER() OVER (PARTITION BY usuario_id ORDER BY fecha_registro DESC) AS rn
             FROM crm_ubicaciones WHERE activo = 1) ub ON ub.usuario_id = u.id AND ub.rn = 1
     WHERE u.rol = 'EJECUTIVO' AND u.activo = 1
     ORDER BY u.nombre;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;

-- MONITOREO_ACTIVIDADES_MAPA
DECLARE l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT a.id, a.tipo, a.descripcion, a.fecha_actividad,
           a.latitud, a.longitud, a.ejecutivo_id, u.nombre AS ejecutivo_nombre
      FROM crm_actividades a
      JOIN crm_usuarios u ON u.id = a.ejecutivo_id
     WHERE a.activo = 1 AND a.latitud IS NOT NULL AND a.longitud IS NOT NULL
       AND (APEX_APPLICATION.G_X01 IS NULL OR TRUNC(a.fecha_actividad) = TO_DATE(APEX_APPLICATION.G_X01,'YYYY-MM-DD'))
     ORDER BY a.fecha_actividad DESC;
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;