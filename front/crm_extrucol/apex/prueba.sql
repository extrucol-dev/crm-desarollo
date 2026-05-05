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