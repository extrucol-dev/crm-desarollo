-- ============================================================
-- CRM EXTRUCOL - CRM_USUARIOS_API SPEC
-- Package para gestión de usuarios
-- ============================================================
CREATE OR REPLACE PACKAGE CRM_USUARIOS_API AS

  PROCEDURE USUARIOS_LIST(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  VARCHAR2 DEFAULT NULL
  );

  PROCEDURE USUARIOS_GET(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  NUMBER
  );

  PROCEDURE USUARIOS_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  VARCHAR2,
    p_x02    IN  VARCHAR2,
    p_x03    IN  VARCHAR2,
    p_x04    IN  NUMBER   DEFAULT NULL,
    p_x05    IN  VARCHAR2 DEFAULT NULL
  );

  PROCEDURE USUARIOS_UPDATE(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  NUMBER,
    p_x02    IN  VARCHAR2,
    p_x03    IN  VARCHAR2,
    p_x04    IN  VARCHAR2,
    p_x05    IN  NUMBER   DEFAULT NULL,
    p_x06    IN  VARCHAR2 DEFAULT NULL
  );

  PROCEDURE USUARIOS_ESTADO(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  NUMBER,
    p_x02    IN  NUMBER
  );

END CRM_USUARIOS_API;
/