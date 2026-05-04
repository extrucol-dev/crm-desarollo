CREATE OR REPLACE PACKAGE BODY CRM_ACTIVIDADES_API AS
  PROCEDURE ACTIVIDADES_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2, p_x02 IN CLOB DEFAULT NULL, p_x03 IN NUMBER DEFAULT 0,
    p_x04 IN VARCHAR2, p_x05 IN NUMBER DEFAULT NULL
  ) IS
    v_id NUMBER;
  BEGIN
    INSERT INTO crm_actividades (tipo, descripcion, virtual, fecha_actividad, oportunidad_id, ejecutivo_id)
      VALUES (p_x01, p_x02, p_x03, TO_DATE(p_x04,'YYYY-MM-DD'), p_x05, 3)
      RETURNING id INTO v_id;
    COMMIT;
    OPEN p_result FOR SELECT v_id AS id, 'true' AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR SELECT 0 AS id, 'false' AS success FROM DUAL;
  END;

  PROCEDURE ACTIVIDADES_GET(p_result OUT SYS_REFCURSOR, p_x01 IN NUMBER) IS
  BEGIN
    OPEN p_result FOR
      SELECT a.id, a.tipo, a.descripcion, a.resultado, a.virtual,
             a.fecha_actividad, a.fecha_registro,
             a.oportunidad_id, o.nombre AS oportunidad_nombre,
             a.ejecutivo_id, u.nombre AS ejecutivo_nombre,
             a.latitud, a.longitud, a.activo, a.fecha_creacion, a.fecha_update
        FROM crm_actividades a
        LEFT JOIN crm_oportunidades o ON o.id = a.oportunidad_id
        JOIN crm_usuarios u ON u.id = a.ejecutivo_id
       WHERE a.id = p_x01;
  END;

  PROCEDURE ACTIVIDADES_UPDATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER, p_x02 IN VARCHAR2, p_x03 IN CLOB DEFAULT NULL,
    p_x04 IN NUMBER DEFAULT NULL, p_x05 IN VARCHAR2 DEFAULT NULL
  ) IS
  BEGIN
    UPDATE crm_actividades
       SET tipo = p_x02, descripcion = p_x03, virtual = p_x04,
           fecha_actividad = TO_DATE(p_x05,'YYYY-MM-DD')
     WHERE id = p_x01;
    COMMIT;
    OPEN p_result FOR SELECT CASE WHEN SQL%ROWCOUNT > 0 THEN 'true' ELSE 'false' END AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR SELECT 'false' AS success FROM DUAL;
  END;

  PROCEDURE ACTIVIDADES_CERRAR(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER, p_x02 IN CLOB, p_x03 IN NUMBER DEFAULT NULL, p_x04 IN NUMBER DEFAULT NULL
  ) IS
  BEGIN
    UPDATE crm_actividades
       SET resultado = p_x02, latitud = p_x03, longitud = p_x04
     WHERE id = p_x01;
    COMMIT;
    OPEN p_result FOR SELECT CASE WHEN SQL%ROWCOUNT > 0 THEN 'true' ELSE 'false' END AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR SELECT 'false' AS success FROM DUAL;
  END;

  PROCEDURE ACTIVIDADES_LIST_TODAS(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2 DEFAULT NULL, p_x02 IN VARCHAR2 DEFAULT NULL
  ) IS
  BEGIN
    OPEN p_result FOR
      SELECT a.id, a.tipo, a.descripcion, a.resultado, a.virtual,
             a.fecha_actividad, a.oportunidad_id, o.nombre AS oportunidad_nombre,
             a.ejecutivo_id, u.nombre AS ejecutivo_nombre,
             a.latitud, a.longitud, a.activo, a.fecha_creacion
        FROM crm_actividades a
        LEFT JOIN crm_oportunidades o ON o.id = a.oportunidad_id
        JOIN crm_usuarios u ON u.id = a.ejecutivo_id
       WHERE a.activo = 1
         AND (p_x01 IS NULL OR a.fecha_actividad >= TO_DATE(p_x01,'YYYY-MM-DD'))
         AND (p_x02 IS NULL OR a.fecha_actividad <= TO_DATE(p_x02,'YYYY-MM-DD'))
       ORDER BY a.fecha_actividad DESC;
  END;

  PROCEDURE ACTIVIDADES_LIST_MIS(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2 DEFAULT NULL, p_x02 IN VARCHAR2 DEFAULT NULL
  ) IS
  BEGIN
    OPEN p_result FOR
      SELECT a.id, a.tipo, a.descripcion, a.resultado, a.virtual,
             a.fecha_actividad, a.oportunidad_id, o.nombre AS oportunidad_nombre,
             a.ejecutivo_id, u.nombre AS ejecutivo_nombre,
             a.latitud, a.longitud, a.activo, a.fecha_creacion
        FROM crm_actividades a
        LEFT JOIN crm_oportunidades o ON o.id = a.oportunidad_id
        JOIN crm_usuarios u ON u.id = a.ejecutivo_id
       WHERE a.ejecutivo_id = 3 AND a.activo = 1
         AND (p_x01 IS NULL OR a.fecha_actividad >= TO_DATE(p_x01,'YYYY-MM-DD'))
         AND (p_x02 IS NULL OR a.fecha_actividad <= TO_DATE(p_x02,'YYYY-MM-DD'))
       ORDER BY a.fecha_actividad DESC;
  END;
END CRM_ACTIVIDADES_API;