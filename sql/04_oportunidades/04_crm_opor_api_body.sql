CREATE OR REPLACE PACKAGE BODY CRM_OPOR_API AS
  PROCEDURE OPORTUNIDADES_LIST(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2 DEFAULT NULL
  ) IS
  BEGIN
    OPEN p_result FOR
      SELECT o.id, o.nombre, o.descripcion, o.tipo, o.estado,
             o.valor_estimado, o.fecha_cierre,
             o.cliente_id, c.empresa AS cliente_nombre,
             o.ejecutivo_id, u.nombre AS ejecutivo_nombre,
             o.motivo_cierre, o.fecha_estado, o.activo,
             o.fecha_creacion
        FROM crm_oportunidades o
        LEFT JOIN crm_clientes c ON c.id = o.cliente_id
        JOIN crm_usuarios u ON u.id = o.ejecutivo_id
       WHERE o.activo = 1
         AND (p_x01 IS NULL OR o.ejecutivo_id = TO_NUMBER(p_x01))
       ORDER BY o.fecha_creacion DESC;
  END;

  PROCEDURE OPORTUNIDADES_LIST_TODAS(p_result OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_result FOR
      SELECT o.id, o.nombre, o.descripcion, o.tipo, o.estado,
             o.valor_estimado, o.fecha_cierre,
             o.cliente_id, c.empresa AS cliente_nombre,
             o.ejecutivo_id, u.nombre AS ejecutivo_nombre,
             o.motivo_cierre, o.fecha_estado, o.activo,
             o.fecha_creacion
        FROM crm_oportunidades o
        LEFT JOIN crm_clientes c ON c.id = o.cliente_id
        JOIN crm_usuarios u ON u.id = o.ejecutivo_id
       WHERE o.activo = 1
       ORDER BY o.fecha_creacion DESC;
  END;

  PROCEDURE OPORTUNIDADES_GET(p_result OUT SYS_REFCURSOR,
                              p_x01 IN NUMBER) IS
  BEGIN
    OPEN p_result FOR
      SELECT o.id, o.nombre, o.descripcion, o.tipo, o.estado,
             o.valor_estimado, o.fecha_cierre,
             o.cliente_id, c.empresa AS cliente_nombre,
             c.nombre AS contacto_nombre,
             o.ejecutivo_id, u.nombre AS ejecutivo_nombre,
             o.motivo_cierre, o.fecha_estado, o.activo,
             o.fecha_creacion, o.fecha_update
        FROM crm_oportunidades o
        LEFT JOIN crm_clientes c ON c.id = o.cliente_id
        JOIN crm_usuarios u ON u.id = o.ejecutivo_id
       WHERE o.id = p_x01;
  END;

  PROCEDURE OPORTUNIDADES_ACTIVIDADES(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER
  ) IS
  BEGIN
    OPEN p_result FOR
      SELECT a.id, a.tipo, a.descripcion, a.resultado, a.virtual,
             a.fecha_actividad, a.oportunidad_id,
             a.ejecutivo_id, u.nombre AS ejecutivo_nombre,
             a.latitud, a.longitud, a.activo, a.fecha_creacion
        FROM crm_actividades a
        JOIN crm_usuarios u ON u.id = a.ejecutivo_id
       WHERE a.oportunidad_id = p_x01 AND a.activo = 1
       ORDER BY a.fecha_actividad DESC;
  END;

  PROCEDURE OPORTUNIDADES_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2,
    p_x02 IN CLOB DEFAULT NULL,
    p_x03 IN VARCHAR2 DEFAULT NULL,
    p_x04 IN NUMBER,
    p_x05 IN VARCHAR2,
    p_x06 IN NUMBER DEFAULT NULL
  ) IS
    v_id NUMBER;
  BEGIN
    INSERT INTO crm_oportunidades
      (nombre, descripcion, tipo, valor_estimado,
       fecha_cierre, cliente_id, ejecutivo_id)
      VALUES (p_x01, p_x02, p_x03, p_x04,
              TO_DATE(p_x05,'YYYY-MM-DD'), p_x06, 3)
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

  PROCEDURE OPORTUNIDADES_UPDATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN VARCHAR2,
    p_x03 IN CLOB DEFAULT NULL,
    p_x04 IN VARCHAR2 DEFAULT NULL,
    p_x05 IN VARCHAR2 DEFAULT NULL,
    p_x06 IN NUMBER DEFAULT NULL,
    p_x07 IN VARCHAR2 DEFAULT NULL,
    p_x08 IN NUMBER DEFAULT NULL
  ) IS
  BEGIN
    UPDATE crm_oportunidades
       SET nombre = p_x02, descripcion = p_x03,
           tipo = p_x04, estado = p_x05,
           valor_estimado = p_x06,
           fecha_cierre = CASE WHEN p_x07 IS NOT NULL
             THEN TO_DATE(p_x07,'YYYY-MM-DD')
             ELSE fecha_cierre END,
           cliente_id = p_x08
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

  PROCEDURE OPORTUNIDADES_AVANZAR(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN VARCHAR2
  ) IS
  BEGIN
    UPDATE crm_oportunidades
       SET estado = p_x02, fecha_estado = SYSDATE
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

  PROCEDURE OPORTUNIDADES_CERRAR(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN VARCHAR2,
    p_x03 IN VARCHAR2,
    p_x04 IN VARCHAR2
  ) IS
  BEGIN
    UPDATE crm_oportunidades
       SET estado = p_x02,
           fecha_cierre = TO_DATE(p_x03,'YYYY-MM-DD'),
           motivo_cierre = p_x04,
           fecha_estado = SYSDATE
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

  PROCEDURE OPORTUNIDADES_ESTANCADAS(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER DEFAULT NULL
  ) IS
    l_dias NUMBER := NVL(TO_NUMBER(p_x01), 7);
  BEGIN
    OPEN p_result FOR
      SELECT o.id, o.nombre, o.estado,
             o.valor_estimado, o.fecha_cierre,
             TRUNC(SYSDATE - MAX(a.fecha_actividad)) AS dias_inactivo,
             o.ejecutivo_id, u.nombre AS ejecutivo_nombre
        FROM crm_oportunidades o
        JOIN crm_usuarios u ON u.id = o.ejecutivo_id
        LEFT JOIN crm_actividades a ON a.oportunidad_id = o.id
       WHERE o.estado NOT IN ('GANADA','PERDIDA')
         AND o.activo = 1
       GROUP BY o.id, o.nombre, o.estado,
                o.valor_estimado, o.fecha_cierre,
                o.ejecutivo_id, u.nombre
      HAVING TRUNC(SYSDATE - MAX(a.fecha_actividad)) > l_dias
       ORDER BY dias_inactivo DESC;
  END;
END CRM_OPOR_API;
/