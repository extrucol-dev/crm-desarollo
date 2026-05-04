-- ============================================================
-- CRM EXTRUCOL - PACKAGE BODIES (FIXED)
-- Fix: removed special chars from string literals
-- ============================================================

CREATE OR REPLACE PACKAGE BODY CRM_USUARIOS_API AS
  PROCEDURE USUARIOS_LIST(p_result OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_result FOR
      SELECT id, nombre, email, rol, ciudad_id, telefono, activo, fecha_creacion
        FROM crm_usuarios ORDER BY nombre;
  END;

  PROCEDURE USUARIOS_GET(p_result OUT SYS_REFCURSOR, p_x01 IN NUMBER) IS
  BEGIN
    OPEN p_result FOR
      SELECT id, nombre, email, rol, ciudad_id, telefono, activo, fecha_creacion
        FROM crm_usuarios WHERE id = p_x01;
  END;

  PROCEDURE USUARIOS_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2, p_x02 IN VARCHAR2, p_x03 IN VARCHAR2, p_x04 IN NUMBER DEFAULT NULL
  ) IS
    v_id NUMBER;
  BEGIN
    INSERT INTO crm_usuarios (nombre, email, contrasena, rol, ciudad_id)
      VALUES (p_x01, p_x02, 'temp123', p_x03, p_x04)
      RETURNING id INTO v_id;
    COMMIT;
    OPEN p_result FOR SELECT v_id AS id, 'true' AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR SELECT 0 AS id, 'false' AS success FROM DUAL;
  END;

  PROCEDURE USUARIOS_UPDATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER, p_x02 IN VARCHAR2, p_x03 IN VARCHAR2, p_x04 IN VARCHAR2, p_x05 IN NUMBER DEFAULT NULL
  ) IS
  BEGIN
    UPDATE crm_usuarios
       SET nombre = p_x02, email = p_x03, rol = p_x04, ciudad_id = p_x05
     WHERE id = p_x01;
    COMMIT;
    OPEN p_result FOR SELECT CASE WHEN SQL%ROWCOUNT > 0 THEN 'true' ELSE 'false' END AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR SELECT 'false' AS success FROM DUAL;
  END;

  PROCEDURE USUARIOS_ESTADO(p_result OUT SYS_REFCURSOR, p_x01 IN NUMBER, p_x02 IN NUMBER) IS
  BEGIN
    UPDATE crm_usuarios SET activo = p_x02 WHERE id = p_x01;
    COMMIT;
    OPEN p_result FOR SELECT CASE WHEN SQL%ROWCOUNT > 0 THEN 'true' ELSE 'false' END AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR SELECT 'false' AS success FROM DUAL;
  END;
END CRM_USUARIOS_API;