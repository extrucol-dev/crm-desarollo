CREATE OR REPLACE PACKAGE BODY CRM_PROYECTOS_API AS
  PROCEDURE PROYECTOS_LIST(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER DEFAULT NULL
  ) IS
  BEGIN
    OPEN p_result FOR
      SELECT p.id, p.nombre, p.descripcion, p.estado,
             p.oportunidad_id, o.nombre AS oportunidad_nombre,
             p.fecha_inicio, p.fecha_fin, p.activo, p.fecha_creacion
        FROM crm_proyectos p
        LEFT JOIN crm_oportunidades o ON o.id = p.oportunidad_id
       WHERE p.activo = 1
         AND (p_x01 IS NULL OR o.ejecutivo_id = p_x01)
       ORDER BY p.fecha_creacion DESC;
  END;

  PROCEDURE PROYECTOS_LIST_TODAS(p_result OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_result FOR
      SELECT p.id, p.nombre, p.descripcion, p.estado,
             p.oportunidad_id, o.nombre AS oportunidad_nombre,
             p.fecha_inicio, p.fecha_fin, p.activo, p.fecha_creacion
        FROM crm_proyectos p
        LEFT JOIN crm_oportunidades o ON o.id = p.oportunidad_id
       WHERE p.activo = 1
       ORDER BY p.fecha_creacion DESC;
  END;

  PROCEDURE PROYECTOS_GET(p_result OUT SYS_REFCURSOR,
                           p_x01 IN NUMBER) IS
  BEGIN
    OPEN p_result FOR
      SELECT p.id, p.nombre, p.descripcion, p.estado,
             p.oportunidad_id, o.nombre AS oportunidad_nombre,
             p.fecha_inicio, p.fecha_fin, p.activo,
             p.fecha_creacion, p.fecha_update
        FROM crm_proyectos p
        LEFT JOIN crm_oportunidades o ON o.id = p.oportunidad_id
       WHERE p.id = p_x01;
  END;

  PROCEDURE PROYECTOS_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2,
    p_x02 IN CLOB DEFAULT NULL,
    p_x03 IN NUMBER DEFAULT NULL
  ) IS
    v_id NUMBER;
  BEGIN
    INSERT INTO crm_proyectos
      (nombre, descripcion, oportunidad_id, fecha_inicio)
      VALUES (p_x01, p_x02, p_x03, SYSDATE)
      RETURNING id INTO v_id;
    COMMIT;
    OPEN p_result FOR
      SELECT v_id AS id, 'true' AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR
        SELECT 0 AS id, 'false' AS success FROM DUAL;
  END;

  PROCEDURE PROYECTOS_UPDATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN VARCHAR2,
    p_x03 IN CLOB DEFAULT NULL,
    p_x04 IN VARCHAR2 DEFAULT NULL,
    p_x05 IN NUMBER DEFAULT NULL
  ) IS
  BEGIN
    UPDATE crm_proyectos
       SET nombre = p_x02,
           descripcion = p_x03,
           estado = p_x04,
           oportunidad_id = NVL(p_x05, oportunidad_id)
     WHERE id = p_x01;
    COMMIT;
    OPEN p_result FOR
      SELECT CASE WHEN SQL%ROWCOUNT > 0
             THEN 'true' ELSE 'false' END AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR
        SELECT 'false' AS success FROM DUAL;
  END;

  PROCEDURE PROYECTOS_ESTADO(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN VARCHAR2
  ) IS
  BEGIN
    UPDATE crm_proyectos SET estado = p_x02 WHERE id = p_x01;
    COMMIT;
    OPEN p_result FOR
      SELECT CASE WHEN SQL%ROWCOUNT > 0
             THEN 'true' ELSE 'false' END AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR
        SELECT 'false' AS success FROM DUAL;
  END;
END CRM_PROYECTOS_API;
/