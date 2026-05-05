-- =============================================================================
-- CRM EXTRUCOL — BODIES: capa de datos
-- pkg_catalogs, pkg_clientes, pkg_leads, pkg_oportunidades,
-- pkg_actividades, pkg_proyectos, pkg_usuarios
-- Ejecutar DESPUÉS de 10_ddl_pkg_specs.sql
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_CATALOGS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_catalogs AS

  PROCEDURE p_ciudades_list(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT m.id_municipio AS id,
             m.nombre,
             d.nombre AS departamento
        FROM crm_municipio m
        JOIN crm_departamento d ON d.id_departamento = m.id_departamento
       ORDER BY d.nombre, m.nombre;
  END;

  PROCEDURE p_config_get(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT id_configuracion AS id, clave, valor, unidad, descripcion
        FROM crm_configuracion_sistema
       ORDER BY clave;
  END;

END pkg_catalogs;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_CLIENTES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_clientes AS

  PROCEDURE p_list(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT e.id_empresa,
             e.nombre,
             e.no_documento,
             e.activo,
             e.nuevo,
             m.nombre  AS ciudad,
             d.nombre  AS departamento,
             NVL2(c.apellido,
                  c.nombre || ' ' || c.apellido,
                  c.nombre)              AS contacto_nombre,
             c.cargo   AS contacto_cargo,
             (SELECT em.email FROM crm_email em
               WHERE em.id_contacto = c.id_contacto
                 AND ROWNUM = 1)         AS contacto_email,
             (SELECT t.numero FROM crm_telefono t
               WHERE t.id_contacto = c.id_contacto
                 AND ROWNUM = 1)         AS contacto_telefono,
             (SELECT COUNT(*) FROM crm_oportunidad o
               WHERE o.id_empresa = e.id_empresa)
                                         AS total_oportunidades,
             (SELECT COUNT(*) FROM crm_oportunidad o
               JOIN crm_estado_oportunidad eo
                    ON eo.id_estado = o.id_estado_oportunidad
              WHERE o.id_empresa = e.id_empresa AND eo.tipo = 'ABIERTO')
                                         AS opps_abiertas
        FROM crm_empresa e
        LEFT JOIN crm_municipio m    ON m.id_municipio    = e.id_municipio
        LEFT JOIN crm_departamento d ON d.id_departamento = m.id_departamento
        LEFT JOIN crm_contacto c     ON c.id_empresa      = e.id_empresa
                                    AND c.es_principal = 1 AND c.activo = 1
       WHERE e.activo = 1
       ORDER BY e.nombre;
  END;

  PROCEDURE p_get(p_id NUMBER, p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT e.id_empresa,
             e.nombre,
             e.no_documento,
             e.activo,
             e.nuevo,
             e.fecha_creacion,
             m.id_municipio,
             m.nombre  AS ciudad,
             d.id_departamento,
             d.nombre  AS departamento,
             doc.tipo  AS tipo_documento,
             mod.nombre AS modalidad
        FROM crm_empresa e
        LEFT JOIN crm_municipio m      ON m.id_municipio      = e.id_municipio
        LEFT JOIN crm_departamento d   ON d.id_departamento   = m.id_departamento
        LEFT JOIN crm_documento doc    ON doc.id_documento    = e.id_documento
        LEFT JOIN crm_modalidad mod    ON mod.id_modalidad    = e.id_modalidad
       WHERE e.id_empresa = p_id;
  END;

  PROCEDURE p_create(
    p_nombre      VARCHAR2, p_nit        VARCHAR2,
    p_municipio   NUMBER,   p_documento  NUMBER,   p_modalidad NUMBER,
    p_cto_nombre  VARCHAR2, p_cto_cargo  VARCHAR2,
    p_cto_email   VARCHAR2, p_cto_tel    VARCHAR2,
    p_id_out  OUT NUMBER
  ) IS
    l_empresa_id  NUMBER;
    l_contacto_id NUMBER;
  BEGIN
    INSERT INTO crm_empresa (nombre, no_documento, id_municipio, id_documento, id_modalidad)
    VALUES (p_nombre, p_nit, p_municipio, p_documento, p_modalidad)
    RETURNING id_empresa INTO l_empresa_id;

    IF p_cto_nombre IS NOT NULL THEN
      INSERT INTO crm_contacto (nombre, cargo, es_principal, id_empresa)
      VALUES (p_cto_nombre, p_cto_cargo, 1, l_empresa_id)
      RETURNING id_contacto INTO l_contacto_id;

      IF p_cto_email IS NOT NULL THEN
        INSERT INTO crm_email (email, id_contacto) VALUES (p_cto_email, l_contacto_id);
      END IF;
      IF p_cto_tel IS NOT NULL THEN
        INSERT INTO crm_telefono (numero, id_contacto) VALUES (p_cto_tel, l_contacto_id);
      END IF;
    END IF;

    COMMIT;
    p_id_out := l_empresa_id;
  END;

  PROCEDURE p_update(
    p_id        NUMBER,   p_nombre    VARCHAR2, p_nit       VARCHAR2,
    p_municipio NUMBER,   p_documento NUMBER,   p_modalidad NUMBER
  ) IS
  BEGIN
    UPDATE crm_empresa
       SET nombre       = p_nombre,
           no_documento = p_nit,
           id_municipio = p_municipio,
           id_documento = p_documento,
           id_modalidad = p_modalidad
     WHERE id_empresa = p_id;
    COMMIT;
  END;

END pkg_clientes;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_LEADS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_leads AS

  PROCEDURE p_list(p_cur OUT SYS_REFCURSOR) IS
    l_uid NUMBER := crm_session_api.get_usuario_id;
  BEGIN
    OPEN p_cur FOR
      SELECT l.id_lead,
             l.titulo,
             l.score,
             el.id_estado_lead,
             el.nombre    AS estado,
             el.tipo      AS estado_tipo,
             el.color_hex AS estado_color,
             ol.id_origen_lead,
             ol.nombre    AS origen,
             ol.color_hex AS origen_color,
             l.nombre_empresa,
             l.nombre_contacto,
             l.telefono_contacto,
             l.email_contacto,
             l.fecha_creacion,
             l.fecha_actualizacion,
             l.id_oportunidad_generada,
             md.nombre    AS motivo_descalificacion
        FROM crm_lead l
        JOIN crm_estado_lead el
             ON el.id_estado_lead = l.id_estado_lead
        JOIN crm_origen_lead ol
             ON ol.id_origen_lead = l.id_origen_lead
        LEFT JOIN crm_motivo_descalificacion md
             ON md.id_motivo_descalificacion = l.id_motivo_descalificacion
       WHERE l.id_usuario = l_uid
       ORDER BY l.fecha_actualizacion DESC;
  END;

  PROCEDURE p_get(p_id NUMBER, p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT l.id_lead,
             l.titulo,
             l.descripcion,
             l.score,
             l.nombre_empresa,
             l.nombre_contacto,
             l.telefono_contacto,
             l.email_contacto,
             l.motivo_descalificacion_obs,
             l.fecha_creacion,
             l.fecha_actualizacion,
             l.id_oportunidad_generada,
             el.id_estado_lead,
             el.nombre    AS estado,
             el.tipo      AS estado_tipo,
             el.color_hex AS estado_color,
             ol.id_origen_lead,
             ol.nombre    AS origen,
             md.nombre    AS motivo_descalificacion,
             u.nombre     AS ejecutivo
        FROM crm_lead l
        JOIN crm_estado_lead el
             ON el.id_estado_lead = l.id_estado_lead
        JOIN crm_origen_lead ol
             ON ol.id_origen_lead = l.id_origen_lead
        LEFT JOIN crm_motivo_descalificacion md
             ON md.id_motivo_descalificacion = l.id_motivo_descalificacion
        JOIN crm_usuario u ON u.id_usuario = l.id_usuario
       WHERE l.id_lead = p_id;
  END;

  PROCEDURE p_create(
    p_titulo       VARCHAR2, p_descripcion   VARCHAR2,
    p_origen       NUMBER,   p_estado        NUMBER,
    p_nombre_emp   VARCHAR2, p_nombre_cto    VARCHAR2,
    p_telefono     VARCHAR2, p_email         VARCHAR2,
    p_score        NUMBER,
    p_id_out   OUT NUMBER
  ) IS
    l_uid    NUMBER := crm_session_api.get_usuario_id;
    l_estado NUMBER := NVL(p_estado, 101);  -- 101=Nuevo por defecto
    l_id     NUMBER;
  BEGIN
    INSERT INTO crm_lead (
      titulo, descripcion, id_origen_lead, id_estado_lead,
      nombre_empresa, nombre_contacto, telefono_contacto, email_contacto,
      score, id_usuario
    ) VALUES (
      p_titulo, p_descripcion, p_origen, l_estado,
      p_nombre_emp, p_nombre_cto, p_telefono, p_email,
      NVL(p_score, 0), l_uid
    ) RETURNING id_lead INTO l_id;

    INSERT INTO crm_historial_estado_lead
      (id_lead, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
    VALUES (l_id, NULL, l_estado, l_uid, 'Lead creado');

    COMMIT;
    p_id_out := l_id;
  END;

  PROCEDURE p_update(
    p_id           NUMBER,   p_titulo       VARCHAR2, p_descripcion VARCHAR2,
    p_estado       NUMBER,   p_score        NUMBER,
    p_nombre_emp   VARCHAR2, p_nombre_cto   VARCHAR2,
    p_telefono     VARCHAR2, p_email        VARCHAR2
  ) IS
  BEGIN
    UPDATE crm_lead
       SET titulo             = NVL(p_titulo,      titulo),
           descripcion        = NVL(p_descripcion, descripcion),
           id_estado_lead     = NVL(p_estado,      id_estado_lead),
           score              = NVL(p_score,       score),
           nombre_empresa     = NVL(p_nombre_emp,  nombre_empresa),
           nombre_contacto    = NVL(p_nombre_cto,  nombre_contacto),
           telefono_contacto  = NVL(p_telefono,    telefono_contacto),
           email_contacto     = NVL(p_email,       email_contacto)
     WHERE id_lead = p_id;
    COMMIT;
  END;

  PROCEDURE p_estado(p_id NUMBER, p_estado NUMBER, p_comentario VARCHAR2) IS
    l_uid      NUMBER := crm_session_api.get_usuario_id;
    l_anterior NUMBER;
  BEGIN
    SELECT id_estado_lead INTO l_anterior FROM crm_lead WHERE id_lead = p_id;

    UPDATE crm_lead SET id_estado_lead = p_estado WHERE id_lead = p_id;

    INSERT INTO crm_historial_estado_lead
      (id_lead, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
    VALUES (p_id, l_anterior, p_estado, l_uid, p_comentario);

    COMMIT;
  END;

  PROCEDURE p_convertir(
    p_id         NUMBER, p_titulo    VARCHAR2, p_valor      NUMBER,
    p_fecha_cie  VARCHAR2, p_tipo    NUMBER,
    p_id_opp_out OUT NUMBER
  ) IS
    l_uid     NUMBER := crm_session_api.get_usuario_id;
    l_opp_id  NUMBER;
    l_anterior NUMBER;
    l_lead    crm_lead%ROWTYPE;
  BEGIN
    SELECT * INTO l_lead FROM crm_lead WHERE id_lead = p_id;

    -- Crear la oportunidad con estado inicial Prospección (101)
    INSERT INTO crm_oportunidad (
      titulo, descripcion, id_tipo_oportunidad, id_estado_oportunidad,
      valor_estimado, fecha_cierre_estimada, id_usuario, id_lead_origen
    ) VALUES (
      p_titulo, l_lead.descripcion, p_tipo, 101,
      p_valor,
      TO_DATE(p_fecha_cie, 'YYYY-MM-DD'),
      l_uid, p_id
    ) RETURNING id_oportunidad INTO l_opp_id;

    INSERT INTO crm_historial_estado
      (id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
    VALUES (l_opp_id, NULL, 101, l_uid, 'Oportunidad creada desde lead #' || p_id);

    -- Marcar lead como convertido
    l_anterior := l_lead.id_estado_lead;
    UPDATE crm_lead
       SET id_estado_lead        = 105,   -- Conversión OK
           id_oportunidad_generada = l_opp_id
     WHERE id_lead = p_id;

    INSERT INTO crm_historial_estado_lead
      (id_lead, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
    VALUES (p_id, l_anterior, 105, l_uid, 'Convertido a oportunidad #' || l_opp_id);

    COMMIT;
    p_id_opp_out := l_opp_id;
  END;

END pkg_leads;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_OPORTUNIDADES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_oportunidades AS

  -- Cursor reutilizable para el SELECT principal de oportunidades
  PROCEDURE p_abrir_cursor_opp(p_cur OUT SYS_REFCURSOR, p_filtro_usuario BOOLEAN) IS
    l_uid NUMBER;
  BEGIN
    IF p_filtro_usuario THEN
      l_uid := crm_session_api.get_usuario_id;
      OPEN p_cur FOR
        SELECT o.id_oportunidad,
               o.titulo,
               o.valor_estimado,
               o.valor_final,
               o.probabilidad_cierre,
               o.fecha_cierre_estimada,
               o.fecha_creacion,
               o.fecha_actualizacion,
               o.descripcion_cierre,
               eo.id_estado,
               eo.nombre    AS estado,
               eo.tipo      AS estado_tipo,
               eo.color_hex AS estado_color,
               eo.orden     AS estado_orden,
               tipo.nombre  AS tipo_oportunidad,
               s.nombre     AS sector,
               s.color_hex  AS sector_color,
               e.id_empresa,
               e.nombre     AS empresa,
               u.nombre     AS ejecutivo,
               mc.nombre    AS motivo_cierre
          FROM crm_oportunidad o
          JOIN crm_estado_oportunidad eo
               ON eo.id_estado = o.id_estado_oportunidad
          LEFT JOIN crm_tipo_oportunidad tipo
               ON tipo.id_tipo_oportunidad = o.id_tipo_oportunidad
          LEFT JOIN crm_sector s    ON s.id_sector  = o.id_sector
          LEFT JOIN crm_empresa e   ON e.id_empresa = o.id_empresa
          JOIN crm_usuario u        ON u.id_usuario = o.id_usuario
          LEFT JOIN crm_motivo_cierre mc ON mc.id_motivo_cierre = o.id_motivo_cierre
         WHERE o.id_usuario = l_uid
         ORDER BY o.fecha_actualizacion DESC;
    ELSE
      OPEN p_cur FOR
        SELECT o.id_oportunidad,
               o.titulo,
               o.valor_estimado,
               o.valor_final,
               o.probabilidad_cierre,
               o.fecha_cierre_estimada,
               o.fecha_creacion,
               o.fecha_actualizacion,
               o.descripcion_cierre,
               eo.id_estado,
               eo.nombre    AS estado,
               eo.tipo      AS estado_tipo,
               eo.color_hex AS estado_color,
               eo.orden     AS estado_orden,
               tipo.nombre  AS tipo_oportunidad,
               s.nombre     AS sector,
               s.color_hex  AS sector_color,
               e.id_empresa,
               e.nombre     AS empresa,
               u.nombre     AS ejecutivo,
               mc.nombre    AS motivo_cierre
          FROM crm_oportunidad o
          JOIN crm_estado_oportunidad eo
               ON eo.id_estado = o.id_estado_oportunidad
          LEFT JOIN crm_tipo_oportunidad tipo
               ON tipo.id_tipo_oportunidad = o.id_tipo_oportunidad
          LEFT JOIN crm_sector s    ON s.id_sector  = o.id_sector
          LEFT JOIN crm_empresa e   ON e.id_empresa = o.id_empresa
          JOIN crm_usuario u        ON u.id_usuario = o.id_usuario
          LEFT JOIN crm_motivo_cierre mc ON mc.id_motivo_cierre = o.id_motivo_cierre
         ORDER BY o.fecha_actualizacion DESC;
    END IF;
  END;

  PROCEDURE p_list(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    p_abrir_cursor_opp(p_cur, TRUE);
  END;

  PROCEDURE p_list_todas(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    p_abrir_cursor_opp(p_cur, FALSE);
  END;

  PROCEDURE p_get(p_id NUMBER, p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT o.id_oportunidad,
             o.titulo,
             o.descripcion,
             o.valor_estimado,
             o.valor_final,
             o.probabilidad_cierre,
             o.fecha_cierre_estimada,
             o.fecha_creacion,
             o.fecha_actualizacion,
             o.id_lead_origen,
             o.descripcion_cierre,
             eo.id_estado,
             eo.nombre    AS estado,
             eo.tipo      AS estado_tipo,
             eo.color_hex AS estado_color,
             tipo.id_tipo_oportunidad,
             tipo.nombre  AS tipo_oportunidad,
             s.id_sector,
             s.nombre     AS sector,
             e.id_empresa,
             e.nombre     AS empresa,
             u.id_usuario AS ejecutivo_id,
             u.nombre     AS ejecutivo,
             mc.nombre    AS motivo_cierre
        FROM crm_oportunidad o
        JOIN crm_estado_oportunidad eo
             ON eo.id_estado = o.id_estado_oportunidad
        LEFT JOIN crm_tipo_oportunidad tipo
             ON tipo.id_tipo_oportunidad = o.id_tipo_oportunidad
        LEFT JOIN crm_sector s    ON s.id_sector  = o.id_sector
        LEFT JOIN crm_empresa e   ON e.id_empresa = o.id_empresa
        JOIN crm_usuario u        ON u.id_usuario = o.id_usuario
        LEFT JOIN crm_motivo_cierre mc ON mc.id_motivo_cierre = o.id_motivo_cierre
       WHERE o.id_oportunidad = p_id;
  END;

  PROCEDURE p_actividades(p_id NUMBER, p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT a.id_actividad,
             a.tipo,
             a.asunto,
             a.descripcion,
             a.resultado,
             a.virtual,
             a.fecha_actividad,
             a.fecha_creacion,
             u.nombre AS ejecutivo,
             ub.latitud,
             ub.longitud
        FROM crm_actividad a
        JOIN crm_usuario u      ON u.id_usuario    = a.id_usuario
        LEFT JOIN crm_ubicacion ub ON ub.id_actividad = a.id_actividad
       WHERE a.id_oportunidad = p_id
       ORDER BY a.fecha_actividad DESC;
  END;

  PROCEDURE p_create(
    p_titulo     VARCHAR2, p_descripcion VARCHAR2,
    p_tipo       NUMBER,   p_valor       NUMBER,
    p_fecha_cie  VARCHAR2, p_empresa     NUMBER,
    p_sector     NUMBER,   p_prob        NUMBER,
    p_id_out OUT NUMBER
  ) IS
    l_uid NUMBER := crm_session_api.get_usuario_id;
    l_id  NUMBER;
  BEGIN
    INSERT INTO crm_oportunidad (
      titulo, descripcion, id_tipo_oportunidad, id_estado_oportunidad,
      valor_estimado, fecha_cierre_estimada,
      id_empresa, id_sector, probabilidad_cierre, id_usuario
    ) VALUES (
      p_titulo, p_descripcion, p_tipo, 101,  -- Prospección
      p_valor, TO_DATE(p_fecha_cie, 'YYYY-MM-DD'),
      p_empresa, p_sector, p_prob, l_uid
    ) RETURNING id_oportunidad INTO l_id;

    INSERT INTO crm_historial_estado
      (id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
    VALUES (l_id, NULL, 101, l_uid, 'Oportunidad creada');

    COMMIT;
    p_id_out := l_id;
  END;

  PROCEDURE p_update(
    p_id         NUMBER,   p_titulo      VARCHAR2, p_descripcion VARCHAR2,
    p_tipo       NUMBER,   p_valor       NUMBER,   p_fecha_cie   VARCHAR2,
    p_empresa    NUMBER,   p_sector      NUMBER,   p_prob        NUMBER,
    p_estado     NUMBER
  ) IS
    l_uid      NUMBER := crm_session_api.get_usuario_id;
    l_anterior NUMBER;
  BEGIN
    SELECT id_estado_oportunidad INTO l_anterior
      FROM crm_oportunidad WHERE id_oportunidad = p_id;

    UPDATE crm_oportunidad
       SET titulo                = NVL(p_titulo,      titulo),
           descripcion           = NVL(p_descripcion, descripcion),
           id_tipo_oportunidad   = NVL(p_tipo,        id_tipo_oportunidad),
           valor_estimado        = NVL(p_valor,        valor_estimado),
           fecha_cierre_estimada = NVL(TO_DATE(p_fecha_cie, 'YYYY-MM-DD'), fecha_cierre_estimada),
           id_empresa            = NVL(p_empresa,      id_empresa),
           id_sector             = NVL(p_sector,       id_sector),
           probabilidad_cierre   = NVL(p_prob,         probabilidad_cierre),
           id_estado_oportunidad = NVL(p_estado,       id_estado_oportunidad)
     WHERE id_oportunidad = p_id;

    IF p_estado IS NOT NULL AND p_estado != l_anterior THEN
      INSERT INTO crm_historial_estado
        (id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
      VALUES (p_id, l_anterior, p_estado, l_uid, 'Actualización de oportunidad');
    END IF;

    COMMIT;
  END;

  PROCEDURE p_avanzar(p_id NUMBER, p_estado NUMBER, p_comentario VARCHAR2) IS
    l_uid      NUMBER := crm_session_api.get_usuario_id;
    l_anterior NUMBER;
  BEGIN
    SELECT id_estado_oportunidad INTO l_anterior
      FROM crm_oportunidad WHERE id_oportunidad = p_id;

    UPDATE crm_oportunidad
       SET id_estado_oportunidad = p_estado
     WHERE id_oportunidad = p_id;

    INSERT INTO crm_historial_estado
      (id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
    VALUES (p_id, l_anterior, p_estado, l_uid, p_comentario);

    COMMIT;
  END;

  PROCEDURE p_cerrar(
    p_id NUMBER, p_estado NUMBER, p_motivo NUMBER,
    p_desc_cierre VARCHAR2, p_fecha_cie VARCHAR2
  ) IS
    l_uid      NUMBER := crm_session_api.get_usuario_id;
    l_anterior NUMBER;
    l_empresa  NUMBER;
  BEGIN
    SELECT id_estado_oportunidad, id_empresa
      INTO l_anterior, l_empresa
      FROM crm_oportunidad WHERE id_oportunidad = p_id;

    UPDATE crm_oportunidad
       SET id_estado_oportunidad = p_estado,
           id_motivo_cierre      = p_motivo,
           descripcion_cierre    = p_desc_cierre,
           fecha_cierre_estimada = NVL(TO_DATE(p_fecha_cie, 'YYYY-MM-DD'), fecha_cierre_estimada),
           valor_final           = valor_estimado   -- snapshot al cerrar
     WHERE id_oportunidad = p_id;

    -- Si ganada y empresa es nueva, marcarla como cliente recurrente
    IF p_estado = 105 AND l_empresa IS NOT NULL THEN
      UPDATE crm_empresa SET nuevo = 0 WHERE id_empresa = l_empresa AND nuevo = 1;
    END IF;

    INSERT INTO crm_historial_estado
      (id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
    VALUES (p_id, l_anterior, p_estado, l_uid,
            CASE p_estado WHEN 105 THEN 'Cerrada GANADA' ELSE 'Cerrada PERDIDA' END);

    COMMIT;
  END;

  PROCEDURE p_estancadas(p_dias NUMBER, p_cur OUT SYS_REFCURSOR) IS
    l_dias NUMBER := NVL(p_dias, 7);
  BEGIN
    OPEN p_cur FOR
      SELECT o.id_oportunidad,
             o.titulo,
             o.valor_estimado,
             o.fecha_actualizacion,
             TRUNC(SYSDATE) - TRUNC(o.fecha_actualizacion) AS dias_sin_actividad,
             eo.nombre    AS estado,
             eo.color_hex AS estado_color,
             e.nombre     AS empresa,
             u.nombre     AS ejecutivo
        FROM crm_oportunidad o
        JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
        LEFT JOIN crm_empresa e        ON e.id_empresa = o.id_empresa
        JOIN crm_usuario u             ON u.id_usuario = o.id_usuario
       WHERE eo.tipo = 'ABIERTO'
         AND TRUNC(SYSDATE) - TRUNC(o.fecha_actualizacion) >= l_dias
       ORDER BY dias_sin_actividad DESC;
  END;

END pkg_oportunidades;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_ACTIVIDADES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_actividades AS

  FUNCTION f_parse_date(p_str VARCHAR2) RETURN DATE IS
  BEGIN
    RETURN CASE WHEN p_str IS NULL THEN NULL
                ELSE TO_DATE(p_str, 'YYYY-MM-DD') END;
  END;

  PROCEDURE p_list_mis(p_inicio VARCHAR2, p_fin VARCHAR2, p_cur OUT SYS_REFCURSOR) IS
    l_uid   NUMBER := crm_session_api.get_usuario_id;
    l_ini   DATE   := NVL(f_parse_date(p_inicio), TRUNC(SYSDATE, 'MM'));
    l_fin   DATE   := NVL(f_parse_date(p_fin),    LAST_DAY(SYSDATE));
  BEGIN
    OPEN p_cur FOR
      SELECT a.id_actividad,
             a.tipo,
             a.asunto,
             a.descripcion,
             a.resultado,
             a.virtual,
             a.fecha_actividad,
             a.fecha_creacion,
             o.id_oportunidad,
             o.titulo  AS oportunidad_titulo,
             l.id_lead,
             l.titulo  AS lead_titulo,
             ub.latitud,
             ub.longitud
        FROM crm_actividad a
        LEFT JOIN crm_oportunidad o ON o.id_oportunidad = a.id_oportunidad
        LEFT JOIN crm_lead l        ON l.id_lead        = a.id_lead
        LEFT JOIN crm_ubicacion ub  ON ub.id_actividad  = a.id_actividad
       WHERE a.id_usuario    = l_uid
         AND a.fecha_actividad BETWEEN l_ini AND l_fin
       ORDER BY a.fecha_actividad DESC;
  END;

  PROCEDURE p_list_todas(p_inicio VARCHAR2, p_fin VARCHAR2, p_cur OUT SYS_REFCURSOR) IS
    l_ini DATE := NVL(f_parse_date(p_inicio), TRUNC(SYSDATE, 'MM'));
    l_fin DATE := NVL(f_parse_date(p_fin),    LAST_DAY(SYSDATE));
  BEGIN
    OPEN p_cur FOR
      SELECT a.id_actividad,
             a.tipo,
             a.asunto,
             a.resultado,
             a.virtual,
             a.fecha_actividad,
             u.nombre  AS ejecutivo,
             o.titulo  AS oportunidad_titulo,
             l.titulo  AS lead_titulo,
             ub.latitud,
             ub.longitud
        FROM crm_actividad a
        JOIN crm_usuario u          ON u.id_usuario    = a.id_usuario
        LEFT JOIN crm_oportunidad o ON o.id_oportunidad = a.id_oportunidad
        LEFT JOIN crm_lead l        ON l.id_lead        = a.id_lead
        LEFT JOIN crm_ubicacion ub  ON ub.id_actividad  = a.id_actividad
       WHERE a.fecha_actividad BETWEEN l_ini AND l_fin
       ORDER BY a.fecha_actividad DESC;
  END;

  PROCEDURE p_get(p_id NUMBER, p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT a.id_actividad,
             a.tipo,
             a.asunto,
             a.descripcion,
             a.resultado,
             a.virtual,
             a.fecha_actividad,
             a.fecha_creacion,
             o.id_oportunidad,
             o.titulo  AS oportunidad_titulo,
             l.id_lead,
             l.titulo  AS lead_titulo,
             u.nombre  AS ejecutivo,
             ub.latitud,
             ub.longitud,
             ub.precision_m,
             ub.direccion
        FROM crm_actividad a
        JOIN crm_usuario u          ON u.id_usuario    = a.id_usuario
        LEFT JOIN crm_oportunidad o ON o.id_oportunidad = a.id_oportunidad
        LEFT JOIN crm_lead l        ON l.id_lead        = a.id_lead
        LEFT JOIN crm_ubicacion ub  ON ub.id_actividad  = a.id_actividad
       WHERE a.id_actividad = p_id;
  END;

  PROCEDURE p_create(
    p_tipo    VARCHAR2, p_asunto      VARCHAR2, p_descripcion VARCHAR2,
    p_virtual NUMBER,   p_fecha_acti  VARCHAR2,
    p_opp     NUMBER,   p_lead        NUMBER,
    p_id_out OUT NUMBER
  ) IS
    l_uid NUMBER := crm_session_api.get_usuario_id;
    l_id  NUMBER;
  BEGIN
    INSERT INTO crm_actividad (
      tipo, asunto, descripcion, virtual, fecha_actividad,
      id_oportunidad, id_lead, id_usuario
    ) VALUES (
      p_tipo, p_asunto, p_descripcion, NVL(p_virtual, 0),
      TO_DATE(p_fecha_acti, 'YYYY-MM-DD'),
      p_opp, p_lead, l_uid
    ) RETURNING id_actividad INTO l_id;

    COMMIT;
    p_id_out := l_id;
  END;

  PROCEDURE p_update(
    p_id      NUMBER,   p_tipo    VARCHAR2, p_asunto  VARCHAR2,
    p_desc    VARCHAR2, p_virtual NUMBER,   p_fecha   VARCHAR2
  ) IS
  BEGIN
    UPDATE crm_actividad
       SET tipo           = NVL(p_tipo,    tipo),
           asunto         = NVL(p_asunto,  asunto),
           descripcion    = NVL(p_desc,    descripcion),
           virtual        = NVL(p_virtual, virtual),
           fecha_actividad = NVL(TO_DATE(p_fecha, 'YYYY-MM-DD'), fecha_actividad)
     WHERE id_actividad = p_id;
    COMMIT;
  END;

  PROCEDURE p_cerrar(
    p_id NUMBER, p_resultado VARCHAR2, p_lat VARCHAR2, p_lon VARCHAR2
  ) IS
  BEGIN
    UPDATE crm_actividad SET resultado = p_resultado WHERE id_actividad = p_id;

    IF p_lat IS NOT NULL AND p_lon IS NOT NULL THEN
      BEGIN
        INSERT INTO crm_ubicacion (latitud, longitud, id_actividad)
        VALUES (TO_NUMBER(p_lat), TO_NUMBER(p_lon), p_id);
      EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
          UPDATE crm_ubicacion
             SET latitud  = TO_NUMBER(p_lat),
                 longitud = TO_NUMBER(p_lon)
           WHERE id_actividad = p_id;
      END;
    END IF;

    COMMIT;
  END;

END pkg_actividades;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_PROYECTOS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_proyectos AS

  PROCEDURE p_list(p_cur OUT SYS_REFCURSOR) IS
    l_uid NUMBER := crm_session_api.get_usuario_id;
  BEGIN
    OPEN p_cur FOR
      SELECT p.id_proyecto,
             p.nombre,
             p.descripcion,
             p.estado,
             p.porcentaje_completado,
             p.fecha_inicio,
             p.fecha_fin,
             p.fecha_creacion,
             p.fecha_actualizacion,
             o.titulo  AS oportunidad_titulo,
             e.nombre  AS empresa,
             (SELECT COUNT(*) FROM crm_proyecto_hito h WHERE h.id_proyecto = p.id_proyecto)
                        AS total_hitos,
             (SELECT COUNT(*) FROM crm_proyecto_hito h
               WHERE h.id_proyecto = p.id_proyecto AND h.estado = 'COMPLETADO')
                        AS hitos_completados
        FROM crm_proyecto p
        JOIN crm_oportunidad o ON o.id_oportunidad = p.id_oportunidad
        LEFT JOIN crm_empresa e ON e.id_empresa    = o.id_empresa
       WHERE p.id_usuario = l_uid
       ORDER BY p.fecha_actualizacion DESC;
  END;

  PROCEDURE p_list_todos(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT p.id_proyecto,
             p.nombre,
             p.estado,
             p.porcentaje_completado,
             p.fecha_inicio,
             p.fecha_fin,
             p.fecha_actualizacion,
             o.titulo  AS oportunidad_titulo,
             e.nombre  AS empresa,
             u.nombre  AS ejecutivo
        FROM crm_proyecto p
        JOIN crm_oportunidad o ON o.id_oportunidad = p.id_oportunidad
        LEFT JOIN crm_empresa e ON e.id_empresa    = o.id_empresa
        JOIN crm_usuario u     ON u.id_usuario     = p.id_usuario
       ORDER BY p.fecha_actualizacion DESC;
  END;

  PROCEDURE p_get(p_id NUMBER, p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT p.id_proyecto,
             p.nombre,
             p.descripcion,
             p.estado,
             p.porcentaje_completado,
             p.fecha_inicio,
             p.fecha_fin,
             p.fecha_creacion,
             p.fecha_actualizacion,
             o.id_oportunidad,
             o.titulo    AS oportunidad_titulo,
             e.id_empresa,
             e.nombre    AS empresa,
             u.nombre    AS ejecutivo
        FROM crm_proyecto p
        JOIN crm_oportunidad o ON o.id_oportunidad = p.id_oportunidad
        LEFT JOIN crm_empresa e ON e.id_empresa    = o.id_empresa
        JOIN crm_usuario u     ON u.id_usuario     = p.id_usuario
       WHERE p.id_proyecto = p_id;
  END;

  PROCEDURE p_create(
    p_nombre  VARCHAR2, p_descripcion VARCHAR2, p_opp NUMBER,
    p_inicio  VARCHAR2, p_fin         VARCHAR2,
    p_id_out OUT NUMBER
  ) IS
    l_uid NUMBER := crm_session_api.get_usuario_id;
    l_id  NUMBER;
  BEGIN
    INSERT INTO crm_proyecto (nombre, descripcion, id_oportunidad, id_usuario,
                              fecha_inicio, fecha_fin)
    VALUES (p_nombre, p_descripcion, p_opp, l_uid,
            TO_DATE(p_inicio, 'YYYY-MM-DD'), TO_DATE(p_fin, 'YYYY-MM-DD'))
    RETURNING id_proyecto INTO l_id;

    COMMIT;
    p_id_out := l_id;
  END;

  PROCEDURE p_update(
    p_id     NUMBER,   p_nombre VARCHAR2, p_desc VARCHAR2,
    p_pct    NUMBER,   p_inicio VARCHAR2, p_fin  VARCHAR2
  ) IS
  BEGIN
    UPDATE crm_proyecto
       SET nombre                = NVL(p_nombre, nombre),
           descripcion           = NVL(p_desc,   descripcion),
           porcentaje_completado = NVL(p_pct,    porcentaje_completado),
           fecha_inicio          = NVL(TO_DATE(p_inicio, 'YYYY-MM-DD'), fecha_inicio),
           fecha_fin             = NVL(TO_DATE(p_fin,    'YYYY-MM-DD'), fecha_fin)
     WHERE id_proyecto = p_id;
    COMMIT;
  END;

  PROCEDURE p_estado(p_id NUMBER, p_estado VARCHAR2) IS
  BEGIN
    UPDATE crm_proyecto SET estado = p_estado WHERE id_proyecto = p_id;
    COMMIT;
  END;

END pkg_proyectos;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_USUARIOS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY pkg_usuarios AS

  PROCEDURE p_list(p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT u.id_usuario,
             u.nombre,
             u.email,
             u.apex_username,
             u.rol,
             u.activo,
             u.fecha_creacion,
             u.ultimo_acceso,
             d.nombre AS departamento
        FROM crm_usuario u
        LEFT JOIN crm_departamento d ON d.id_departamento = u.id_departamento
       WHERE u.rol != 'ADMINISTRADOR'
       ORDER BY u.rol, u.nombre;
  END;

  PROCEDURE p_get(p_id NUMBER, p_cur OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cur FOR
      SELECT u.id_usuario,
             u.nombre,
             u.email,
             u.apex_username,
             u.rol,
             u.activo,
             u.fecha_creacion,
             u.ultimo_acceso,
             d.nombre AS departamento,
             (SELECT COUNT(*) FROM crm_lead l
               WHERE l.id_usuario = u.id_usuario)        AS total_leads,
             (SELECT COUNT(*) FROM crm_oportunidad o
               WHERE o.id_usuario = u.id_usuario)        AS total_oportunidades,
             (SELECT COUNT(*) FROM crm_actividad a
               WHERE a.id_usuario = u.id_usuario
                 AND EXTRACT(MONTH FROM a.fecha_actividad) = EXTRACT(MONTH FROM SYSDATE)
                 AND EXTRACT(YEAR  FROM a.fecha_actividad) = EXTRACT(YEAR  FROM SYSDATE))
                                                          AS actividades_mes
        FROM crm_usuario u
        LEFT JOIN crm_departamento d ON d.id_departamento = u.id_departamento
       WHERE u.id_usuario = p_id;
  END;

  PROCEDURE p_create(
    p_nombre VARCHAR2, p_email VARCHAR2, p_rol VARCHAR2,
    p_depto  NUMBER,   p_apex  VARCHAR2,
    p_id_out OUT NUMBER
  ) IS
    l_id NUMBER;
  BEGIN
    INSERT INTO crm_usuario (nombre, email, apex_username, password, rol, id_departamento)
    VALUES (p_nombre, LOWER(p_email), UPPER(p_apex), 'APEX_MANAGED', p_rol, p_depto)
    RETURNING id_usuario INTO l_id;
    COMMIT;
    p_id_out := l_id;
  END;

  PROCEDURE p_update(
    p_id    NUMBER,   p_nombre VARCHAR2, p_email VARCHAR2,
    p_rol   VARCHAR2, p_depto  NUMBER,   p_apex  VARCHAR2
  ) IS
  BEGIN
    UPDATE crm_usuario
       SET nombre        = NVL(p_nombre, nombre),
           email         = NVL(LOWER(p_email), email),
           rol           = NVL(p_rol,   rol),
           id_departamento = NVL(p_depto, id_departamento),
           apex_username = NVL(UPPER(p_apex), apex_username)
     WHERE id_usuario = p_id;
    COMMIT;
  END;

  PROCEDURE p_estado(p_id NUMBER, p_activo NUMBER) IS
  BEGIN
    UPDATE crm_usuario SET activo = p_activo WHERE id_usuario = p_id;
    COMMIT;
  END;

END pkg_usuarios;
/

PROMPT ✓ Package bodies (capa datos) compilados: catalogs, clientes, leads, oportunidades, actividades, proyectos, usuarios.
