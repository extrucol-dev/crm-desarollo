CREATE OR REPLACE PACKAGE BODY CRM_CLIENTES_API AS
  PROCEDURE CLIENTES_LIST(p_result OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_result FOR
      SELECT c.id, c.nombre, c.empresa, c.sector,
             c.ciudad_id, ciu.ciudad AS ciudad_nombre,
             c.email, c.telefono, c.direccion,
             c.activo, c.fecha_creacion
        FROM crm_clientes c
        LEFT JOIN crm_ciudades ciu ON ciu.id = c.ciudad_id
       WHERE c.activo = 1
       ORDER BY c.fecha_creacion DESC;
  END;

  PROCEDURE CLIENTES_GET(p_result OUT SYS_REFCURSOR,
                         p_x01 IN NUMBER) IS
  BEGIN
    OPEN p_result FOR
      SELECT c.id, c.nombre, c.empresa, c.sector,
             c.ciudad_id, ciu.ciudad AS ciudad_nombre,
             c.email, c.telefono, c.direccion,
             c.activo, c.fecha_creacion
        FROM crm_clientes c
        LEFT JOIN crm_ciudades ciu ON ciu.id = c.ciudad_id
       WHERE c.id = p_x01;
  END;

  PROCEDURE CLIENTES_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2,
    p_x02 IN VARCHAR2,
    p_x03 IN VARCHAR2,
    p_x04 IN NUMBER DEFAULT NULL,
    p_x05 IN VARCHAR2 DEFAULT NULL,
    p_x06 IN VARCHAR2 DEFAULT NULL
  ) IS
    v_id NUMBER;
  BEGIN
    INSERT INTO crm_clientes
      (nombre, empresa, sector, ciudad_id, email, telefono)
      VALUES (p_x01, p_x02, p_x03, p_x04, p_x05, p_x06)
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

  PROCEDURE CLIENTES_UPDATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN VARCHAR2,
    p_x03 IN VARCHAR2,
    p_x04 IN VARCHAR2,
    p_x05 IN NUMBER DEFAULT NULL,
    p_x06 IN VARCHAR2 DEFAULT NULL,
    p_x07 IN VARCHAR2 DEFAULT NULL
  ) IS
  BEGIN
    UPDATE crm_clientes
       SET nombre = p_x02, empresa = p_x03,
           sector = p_x04, ciudad_id = p_x05,
           email = p_x06, telefono = p_x07
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
END CRM_CLIENTES_API;
/