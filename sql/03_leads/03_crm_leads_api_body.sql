CREATE OR REPLACE PACKAGE BODY CRM_LEADS_API AS
  PROCEDURE LEADS_LIST(p_result OUT SYS_REFCURSOR,
                       p_x01 IN VARCHAR2 DEFAULT NULL) IS
  BEGIN
    OPEN p_result FOR
      SELECT l.id, l.nombre, l.empresa, l.email,
             l.telefono, l.origen, l.sector,
             l.ciudad_id, ciu.ciudad AS ciudad_nombre,
             l.descripcion, l.estado,
             l.ejecutivo_id, u.nombre AS ejecutivo_nombre,
             l.activo, l.fecha_creacion
        FROM crm_leads l
        LEFT JOIN crm_ciudades ciu ON ciu.id = l.ciudad_id
        LEFT JOIN crm_usuarios u ON u.id = l.ejecutivo_id
       WHERE l.activo = 1
         AND (p_x01 IS NULL OR l.ejecutivo_id = TO_NUMBER(p_x01))
       ORDER BY l.fecha_creacion DESC;
  END;

  PROCEDURE LEADS_GET(p_result OUT SYS_REFCURSOR,
                      p_x01 IN NUMBER) IS
  BEGIN
    OPEN p_result FOR
      SELECT l.id, l.nombre, l.empresa, l.email,
             l.telefono, l.origen, l.sector,
             l.ciudad_id, ciu.ciudad AS ciudad_nombre,
             l.descripcion, l.estado,
             l.ejecutivo_id, u.nombre AS ejecutivo_nombre,
             l.activo, l.fecha_creacion
        FROM crm_leads l
        LEFT JOIN crm_ciudades ciu ON ciu.id = l.ciudad_id
        LEFT JOIN crm_usuarios u ON u.id = l.ejecutivo_id
       WHERE l.id = p_x01;
  END;

  PROCEDURE LEADS_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2,
    p_x02 IN VARCHAR2 DEFAULT NULL,
    p_x03 IN VARCHAR2 DEFAULT NULL,
    p_x04 IN VARCHAR2 DEFAULT NULL,
    p_x05 IN VARCHAR2 DEFAULT NULL,
    p_x06 IN VARCHAR2 DEFAULT NULL,
    p_x07 IN NUMBER DEFAULT NULL,
    p_x08 IN CLOB DEFAULT NULL
  ) IS
    v_id NUMBER;
  BEGIN
    INSERT INTO crm_leads
      (nombre, empresa, email, telefono, origen,
       sector, ciudad_id, descripcion, ejecutivo_id)
      VALUES (p_x01, p_x02, p_x03, p_x04, p_x05,
              p_x06, p_x07, p_x08, 3)
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

  PROCEDURE LEADS_UPDATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN VARCHAR2,
    p_x03 IN VARCHAR2 DEFAULT NULL,
    p_x04 IN VARCHAR2 DEFAULT NULL,
    p_x05 IN VARCHAR2 DEFAULT NULL,
    p_x06 IN VARCHAR2 DEFAULT NULL,
    p_x07 IN NUMBER DEFAULT NULL,
    p_x08 IN CLOB DEFAULT NULL
  ) IS
  BEGIN
    UPDATE crm_leads
       SET nombre = p_x02, empresa = p_x03,
           email = p_x04, telefono = p_x05,
           origen = p_x06, sector = p_x07,
           ciudad_id = p_x07, descripcion = p_x08
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

  PROCEDURE LEADS_ESTADO(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN VARCHAR2
  ) IS
  BEGIN
    UPDATE crm_leads SET estado = p_x02 WHERE id = p_x01;
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

  PROCEDURE LEADS_CONVERTIR(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN VARCHAR2,
    p_x03 IN NUMBER,
    p_x04 IN VARCHAR2
  ) IS
    v_id NUMBER;
  BEGIN
    INSERT INTO crm_oportunidades
      (nombre, valor_estimado, fecha_cierre, cliente_id, ejecutivo_id)
      VALUES (p_x02, p_x03, TO_DATE(p_x04,'YYYY-MM-DD'), p_x01, 3)
      RETURNING id INTO v_id;
    UPDATE crm_leads SET estado = 'CONVERTIDO' WHERE id = p_x01;
    COMMIT;
    OPEN p_result FOR
      SELECT v_id AS id, 'true' AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR
        SELECT 0 AS id, 'false' AS success FROM DUAL;
  END;
END CRM_LEADS_API;
/