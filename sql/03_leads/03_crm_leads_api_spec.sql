-- ============================================================
-- CRM EXTRUCOL - CRM_LEADS_API SPEC
-- ============================================================
CREATE OR REPLACE PACKAGE CRM_LEADS_API AS

  PROCEDURE LEADS_LIST(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  VARCHAR2 DEFAULT NULL
  );

  PROCEDURE LEADS_GET(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  NUMBER
  );

  PROCEDURE LEADS_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  VARCHAR2,
    p_x02    IN  VARCHAR2 DEFAULT NULL,
    p_x03    IN  VARCHAR2 DEFAULT NULL,
    p_x04    IN  VARCHAR2 DEFAULT NULL,
    p_x05    IN  VARCHAR2 DEFAULT NULL,
    p_x06    IN  VARCHAR2 DEFAULT NULL,
    p_x07    IN  NUMBER   DEFAULT NULL,
    p_x08    IN  CLOB     DEFAULT NULL
  );

  PROCEDURE LEADS_UPDATE(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  NUMBER,
    p_x02    IN  VARCHAR2,
    p_x03    IN  VARCHAR2 DEFAULT NULL,
    p_x04    IN  VARCHAR2 DEFAULT NULL,
    p_x05    IN  VARCHAR2 DEFAULT NULL,
    p_x06    IN  VARCHAR2 DEFAULT NULL,
    p_x07    IN  VARCHAR2 DEFAULT NULL,
    p_x08    IN  NUMBER   DEFAULT NULL,
    p_x09    IN  CLOB     DEFAULT NULL
  );

  PROCEDURE LEADS_ESTADO(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  NUMBER,
    p_x02    IN  VARCHAR2
  );

  PROCEDURE LEADS_CONVERTIR(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  NUMBER,
    p_x02    IN  VARCHAR2,
    p_x03    IN  NUMBER,
    p_x04    IN  VARCHAR2
  );

END CRM_LEADS_API;
/