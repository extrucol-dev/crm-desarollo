-- =============================================================================
-- CRM EXTRUCOL — APEX Application Processes  (PARTE 1 de 2)
-- =============================================================================
-- Cómo registrar en APEX Builder:
--   App Builder → Tu Aplicación → Shared Components → Application Processes → Create
--   Point : On Demand - Run this application process when requested by a page process
--   Type  : PL/SQL Anonymous Block
--   Pegar el bloque DECLARE…END; correspondiente en "Source"
--
-- Tablas base (CRM_ER_v6):
--   CRM_USUARIO, CRM_EMPRESA, CRM_CONTACTO, CRM_EMAIL, CRM_TELEFONO,
--   CRM_MUNICIPIO, CRM_DEPARTAMENTO, CRM_SECTOR, CRM_LEAD, CRM_ESTADO_LEAD,
--   CRM_ORIGEN_LEAD, CRM_OPORTUNIDAD, CRM_ESTADO_OPORTUNIDAD,
--   CRM_TIPO_OPORTUNIDAD, CRM_MOTIVO_CIERRE, CRM_ACTIVIDAD, CRM_UBICACION,
--   CRM_PROYECTO, CRM_META, CRM_CUMPLIMIENTO_META, CRM_NOTIFICACION,
--   CRM_CONFIGURACION_SISTEMA
--
-- Convención de parámetros:
--   APEX_APPLICATION.G_X01 … G_X10  ←→  callProcess('PROC', {x01:..., x02:...})
--   v('APP_USER') = email del usuario logueado en APEX
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. USUARIO_ACTUAL
--    Devuelve el perfil del usuario de sesión APEX.
--    Consumido por useApexSession() al iniciar la app.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: USUARIO_ACTUAL
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT u.id_usuario  AS id,
           u.nombre,
           UPPER(u.rol)  AS rol
      FROM crm_usuario u
     WHERE UPPER(u.email) = UPPER(v('APP_USER'))
       AND u.activo = 1;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);   -- unwrapSingle() toma el primer elemento
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. CIUDADES_LIST
--    Catálogo de municipios para selects de formularios.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: CIUDADES_LIST
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT m.id_municipio AS id,
           m.nombre,
           d.nombre       AS departamento
      FROM crm_municipio m
      JOIN crm_departamento d ON d.id_departamento = m.id_departamento
     ORDER BY d.nombre, m.nombre;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. CLIENTES_LIST
--    Lista empresas activas con su contacto principal, ciudad y sector
--    (sector = sector más frecuente en sus oportunidades, puede ser NULL).
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: CLIENTES_LIST
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT e.id_empresa                               AS id,
           e.nombre                                   AS empresa,
           c.nombre || ' ' || c.apellido              AS nombre,
           m.nombre                                   AS ciudad,
           m.id_municipio                             AS ciudad_id,
           em.email,
           t.numero                                   AS telefono,
           e.activo,
           e.fecha_creacion
      FROM crm_empresa e
      LEFT JOIN crm_contacto c  ON c.id_empresa = e.id_empresa
                               AND c.es_principal = 1
                               AND c.activo = 1
      LEFT JOIN crm_email em    ON em.id_contacto = c.id_contacto
                               AND ROWNUM = 1
      LEFT JOIN crm_telefono t  ON t.id_contacto = c.id_contacto
                               AND ROWNUM = 1
      LEFT JOIN crm_municipio m ON m.id_municipio = e.id_municipio
     WHERE e.activo = 1
     ORDER BY e.nombre;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. CLIENTES_GET  (x01 = id_empresa)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: CLIENTES_GET
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT e.id_empresa                               AS id,
           e.nombre                                   AS empresa,
           c.nombre || ' ' || c.apellido              AS nombre,
           c.cargo,
           m.nombre                                   AS ciudad,
           m.id_municipio                             AS ciudad_id,
           em.email,
           t.numero                                   AS telefono,
           e.activo,
           e.fecha_creacion
      FROM crm_empresa e
      LEFT JOIN crm_contacto c  ON c.id_empresa = e.id_empresa AND c.es_principal = 1
      LEFT JOIN crm_email em    ON em.id_contacto = c.id_contacto
      LEFT JOIN crm_telefono t  ON t.id_contacto = c.id_contacto
      LEFT JOIN crm_municipio m ON m.id_municipio = e.id_municipio
     WHERE e.id_empresa = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. CLIENTES_CREATE
--    x01=nombre_contacto, x02=nombre_empresa, x03=sector(ignorado en v6),
--    x04=ciudad_id, x05=email, x06=telefono
--    Crea CRM_EMPRESA + CRM_CONTACTO (principal) + CRM_EMAIL + CRM_TELEFONO
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: CLIENTES_CREATE
DECLARE
  l_empresa_id   NUMBER;
  l_contacto_id  NUMBER;
BEGIN
  -- Empresa
  INSERT INTO crm_empresa (id_empresa, nombre, activo, nuevo, fecha_creacion, id_municipio)
  VALUES (crm_empresa_seq.NEXTVAL,
          APEX_APPLICATION.G_X02,
          1, 1, SYSDATE,
          TO_NUMBER(NULLIF(APEX_APPLICATION.G_X04, '')))
  RETURNING id_empresa INTO l_empresa_id;

  -- Contacto principal
  INSERT INTO crm_contacto (id_contacto, nombre, apellido, es_principal, activo, fecha_creacion, id_empresa)
  VALUES (crm_contacto_seq.NEXTVAL,
          APEX_APPLICATION.G_X01,
          NULL, 1, 1, SYSDATE,
          l_empresa_id)
  RETURNING id_contacto INTO l_contacto_id;

  -- Email
  IF APEX_APPLICATION.G_X05 IS NOT NULL THEN
    INSERT INTO crm_email (id_email, email, id_contacto)
    VALUES (crm_email_seq.NEXTVAL, APEX_APPLICATION.G_X05, l_contacto_id);
  END IF;

  -- Teléfono
  IF APEX_APPLICATION.G_X06 IS NOT NULL THEN
    INSERT INTO crm_telefono (id_telefono, numero, id_contacto)
    VALUES (crm_telefono_seq.NEXTVAL, APEX_APPLICATION.G_X06, l_contacto_id);
  END IF;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id',      l_empresa_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. CLIENTES_UPDATE
--    x01=id_empresa, x02=nombre_contacto, x03=nombre_empresa,
--    x04=sector(ignorado), x05=ciudad_id, x06=email, x07=telefono
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: CLIENTES_UPDATE
DECLARE
  l_id          NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_contacto_id NUMBER;
BEGIN
  UPDATE crm_empresa
     SET nombre       = APEX_APPLICATION.G_X03,
         id_municipio = TO_NUMBER(NULLIF(APEX_APPLICATION.G_X05, ''))
   WHERE id_empresa = l_id;

  -- Contacto principal
  SELECT id_contacto INTO l_contacto_id
    FROM crm_contacto
   WHERE id_empresa = l_id AND es_principal = 1 AND ROWNUM = 1;

  UPDATE crm_contacto
     SET nombre = APEX_APPLICATION.G_X02
   WHERE id_contacto = l_contacto_id;

  -- Email: MERGE (update si existe, insert si no)
  MERGE INTO crm_email em
  USING (SELECT l_contacto_id AS id_contacto FROM DUAL) src
     ON (em.id_contacto = src.id_contacto)
   WHEN MATCHED THEN
     UPDATE SET em.email = APEX_APPLICATION.G_X06
   WHEN NOT MATCHED THEN
     INSERT (id_email, email, id_contacto)
     VALUES (crm_email_seq.NEXTVAL, APEX_APPLICATION.G_X06, l_contacto_id);

  -- Teléfono
  MERGE INTO crm_telefono t
  USING (SELECT l_contacto_id AS id_contacto FROM DUAL) src
     ON (t.id_contacto = src.id_contacto)
   WHEN MATCHED THEN
     UPDATE SET t.numero = APEX_APPLICATION.G_X07
   WHEN NOT MATCHED THEN
     INSERT (id_telefono, numero, id_contacto)
     VALUES (crm_telefono_seq.NEXTVAL, APEX_APPLICATION.G_X07, l_contacto_id);

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT >= 0);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. LEADS_LIST
--    Leads del ejecutivo de sesión, con estado y origen.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: LEADS_LIST
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  OPEN l_cur FOR
    SELECT l.id_lead                  AS id,
           l.titulo,
           l.descripcion,
           l.score,
           l.nombre_empresa,
           l.nombre_contacto,
           l.telefono_contacto        AS telefono,
           l.email_contacto           AS email,
           l.fecha_creacion,
           l.fecha_actualizacion,
           el.nombre                  AS estado,
           el.tipo                    AS estado_tipo,
           el.color_hex               AS estado_color,
           ol.nombre                  AS origen,
           ol.color_hex               AS origen_color,
           CASE WHEN l.id_oportunidad_generada IS NOT NULL THEN 1 ELSE 0 END AS convertido
      FROM crm_lead l
      JOIN crm_estado_lead el  ON el.id_estado_lead = l.id_estado_lead
      JOIN crm_origen_lead ol  ON ol.id_origen_lead = l.id_origen_lead
     WHERE l.id_usuario = l_usuario_id
     ORDER BY l.fecha_actualizacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. LEADS_GET  (x01 = id_lead)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: LEADS_GET
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT l.id_lead                  AS id,
           l.titulo,
           l.descripcion,
           l.score,
           l.nombre_empresa,
           l.nombre_contacto,
           l.telefono_contacto        AS telefono,
           l.email_contacto           AS email,
           l.fecha_creacion,
           l.fecha_actualizacion,
           el.id_estado_lead          AS estado_id,
           el.nombre                  AS estado,
           el.tipo                    AS estado_tipo,
           ol.id_origen_lead          AS origen_id,
           ol.nombre                  AS origen,
           l.id_oportunidad_generada,
           l.motivo_descalificacion_obs
      FROM crm_lead l
      JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
      JOIN crm_origen_lead ol ON ol.id_origen_lead = l.id_origen_lead
     WHERE l.id_lead = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 9. LEADS_CREATE
--    x01=titulo, x02=nombre_empresa, x03=email, x04=telefono,
--    x05=origen_id, x06=sector(texto, no usado en tabla), x07=ciudad_id(no usado),
--    x08=descripcion
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: LEADS_CREATE
DECLARE
  l_id          NUMBER;
  l_usuario_id  NUMBER;
  l_estado_id   NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  -- Estado inicial = primer estado activo (orden ASC)
  SELECT id_estado_lead INTO l_estado_id
    FROM (SELECT id_estado_lead FROM crm_estado_lead ORDER BY orden ASC)
   WHERE ROWNUM = 1;

  INSERT INTO crm_lead (
    id_lead, titulo, descripcion, score,
    id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto,
    telefono_contacto, email_contacto,
    fecha_creacion, fecha_actualizacion,
    id_usuario
  ) VALUES (
    crm_lead_seq.NEXTVAL,
    APEX_APPLICATION.G_X01,
    APEX_APPLICATION.G_X08,
    0,
    l_estado_id,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X05, '')),
    APEX_APPLICATION.G_X02,
    NULL,
    APEX_APPLICATION.G_X04,
    APEX_APPLICATION.G_X03,
    SYSDATE, SYSDATE,
    l_usuario_id
  ) RETURNING id_lead INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id',      l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 10. LEADS_UPDATE
--     x01=id_lead, x02=titulo, x03=nombre_empresa, x04=email,
--     x05=telefono, x06=origen_id, x07=sector(ignorado), x08=descripcion
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: LEADS_UPDATE
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_lead
     SET titulo              = APEX_APPLICATION.G_X02,
         nombre_empresa      = APEX_APPLICATION.G_X03,
         email_contacto      = APEX_APPLICATION.G_X04,
         telefono_contacto   = APEX_APPLICATION.G_X05,
         id_origen_lead      = TO_NUMBER(NULLIF(APEX_APPLICATION.G_X06, '')),
         descripcion         = APEX_APPLICATION.G_X08,
         fecha_actualizacion = SYSDATE
   WHERE id_lead = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 11. LEADS_ESTADO  (x01=id_lead, x02=nombre_estado)
--     Avanza el estado del lead por nombre.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: LEADS_ESTADO
DECLARE
  l_id         NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_estado_id  NUMBER;
  l_usuario_id NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  SELECT id_estado_lead INTO l_estado_id
    FROM crm_estado_lead
   WHERE UPPER(nombre) = UPPER(APEX_APPLICATION.G_X02);

  -- Registrar historial
  INSERT INTO crm_historial_estado_lead (
    id_historial_lead, id_lead,
    id_estado_anterior, id_estado_nuevo,
    fecha_cambio, id_usuario
  )
  SELECT crm_hist_lead_seq.NEXTVAL,
         l_id,
         id_estado_lead,
         l_estado_id,
         SYSDATE,
         l_usuario_id
    FROM crm_lead WHERE id_lead = l_id;

  UPDATE crm_lead
     SET id_estado_lead      = l_estado_id,
         fecha_actualizacion = SYSDATE
   WHERE id_lead = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 12. LEADS_CONVERTIR
--     x01=id_lead, x02=nombre_oportunidad, x03=valor_estimado,
--     x04=fecha_cierre (YYYY-MM-DD)
--     Crea CRM_OPORTUNIDAD y vincula el lead.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: LEADS_CONVERTIR
DECLARE
  l_lead_id    NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_opp_id     NUMBER;
  l_usuario_id NUMBER;
  l_estado_id  NUMBER;
  l_empresa_id NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  -- Estado inicial de oportunidad (primer estado, orden ASC)
  SELECT id_estado INTO l_estado_id
    FROM (SELECT id_estado FROM crm_estado_oportunidad WHERE tipo = 'ABIERTO' ORDER BY orden ASC)
   WHERE ROWNUM = 1;

  -- Empresa del lead (puede ser NULL si es solo prospecto)
  SELECT id_empresa INTO l_empresa_id
    FROM crm_empresa
   WHERE nombre = (SELECT nombre_empresa FROM crm_lead WHERE id_lead = l_lead_id)
     AND ROWNUM = 1;

  INSERT INTO crm_oportunidad (
    id_oportunidad, titulo, id_estado_oportunidad,
    valor_estimado, fecha_cierre_estimada,
    fecha_creacion, fecha_actualizacion,
    id_empresa, id_usuario, id_lead_origen
  ) VALUES (
    crm_oportunidad_seq.NEXTVAL,
    APEX_APPLICATION.G_X02,
    l_estado_id,
    TO_NUMBER(NULLIF(REPLACE(APEX_APPLICATION.G_X03, ',', '.'), '')),
    TO_DATE(NULLIF(APEX_APPLICATION.G_X04, ''), 'YYYY-MM-DD'),
    SYSDATE, SYSDATE,
    l_empresa_id,
    l_usuario_id,
    l_lead_id
  ) RETURNING id_oportunidad INTO l_opp_id;

  -- Marcar lead como convertido
  UPDATE crm_lead
     SET id_oportunidad_generada = l_opp_id,
         fecha_actualizacion     = SYSDATE
   WHERE id_lead = l_lead_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id_oportunidad', l_opp_id);
  APEX_JSON.WRITE('success',        TRUE);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 13. OPORTUNIDADES_LIST  — del ejecutivo de sesión
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_LIST
DECLARE
  l_cur        SYS_REFCURSOR;
  l_usuario_id NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  OPEN l_cur FOR
    SELECT o.id_oportunidad               AS id,
           o.titulo,
           o.descripcion,
           o.valor_estimado,
           o.valor_final,
           o.probabilidad_cierre,
           o.fecha_cierre_estimada,
           o.fecha_creacion,
           o.fecha_actualizacion,
           eo.id_estado                   AS estado_id,
           eo.nombre                      AS estado,
           eo.tipo                        AS estado_tipo,
           eo.orden                       AS estado_orden,
           eo.color_hex                   AS estado_color,
           tp.nombre                      AS tipo,
           s.nombre                       AS sector,
           e.nombre                       AS empresa,
           e.id_empresa                   AS empresa_id
      FROM crm_oportunidad o
      JOIN crm_estado_oportunidad eo ON eo.id_estado      = o.id_estado_oportunidad
      LEFT JOIN crm_tipo_oportunidad tp ON tp.id_tipo_oportunidad = o.id_tipo_oportunidad
      LEFT JOIN crm_sector s            ON s.id_sector    = o.id_sector
      LEFT JOIN crm_empresa e           ON e.id_empresa   = o.id_empresa
     WHERE o.id_usuario = l_usuario_id
     ORDER BY eo.orden, o.fecha_actualizacion DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 14. OPORTUNIDADES_LIST_TODAS  — director/coordinador, todas las del equipo
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_LIST_TODAS
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT o.id_oportunidad               AS id,
           o.titulo,
           o.valor_estimado,
           o.probabilidad_cierre,
           o.fecha_cierre_estimada,
           o.fecha_actualizacion,
           eo.nombre                      AS estado,
           eo.tipo                        AS estado_tipo,
           eo.orden                       AS estado_orden,
           tp.nombre                      AS tipo,
           s.nombre                       AS sector,
           e.nombre                       AS empresa,
           u.nombre                       AS ejecutivo,
           u.id_usuario                   AS ejecutivo_id
      FROM crm_oportunidad o
      JOIN crm_estado_oportunidad eo ON eo.id_estado         = o.id_estado_oportunidad
      LEFT JOIN crm_tipo_oportunidad tp ON tp.id_tipo_oportunidad = o.id_tipo_oportunidad
      LEFT JOIN crm_sector s            ON s.id_sector        = o.id_sector
      LEFT JOIN crm_empresa e           ON e.id_empresa       = o.id_empresa
      JOIN crm_usuario u                ON u.id_usuario       = o.id_usuario
     ORDER BY eo.orden, o.valor_estimado DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 15. OPORTUNIDADES_GET  (x01 = id_oportunidad)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_GET
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT o.id_oportunidad               AS id,
           o.titulo,
           o.descripcion,
           o.valor_estimado,
           o.valor_final,
           o.probabilidad_cierre,
           o.fecha_cierre_estimada,
           o.fecha_creacion,
           o.fecha_actualizacion,
           o.descripcion_cierre,
           eo.id_estado                   AS estado_id,
           eo.nombre                      AS estado,
           eo.tipo                        AS estado_tipo,
           eo.orden                       AS estado_orden,
           tp.id_tipo_oportunidad         AS tipo_id,
           tp.nombre                      AS tipo,
           s.id_sector                    AS sector_id,
           s.nombre                       AS sector,
           e.id_empresa                   AS empresa_id,
           e.nombre                       AS empresa,
           u.nombre                       AS ejecutivo,
           mc.nombre                      AS motivo_cierre
      FROM crm_oportunidad o
      JOIN crm_estado_oportunidad eo ON eo.id_estado         = o.id_estado_oportunidad
      LEFT JOIN crm_tipo_oportunidad tp ON tp.id_tipo_oportunidad = o.id_tipo_oportunidad
      LEFT JOIN crm_sector s            ON s.id_sector        = o.id_sector
      LEFT JOIN crm_empresa e           ON e.id_empresa       = o.id_empresa
      JOIN crm_usuario u                ON u.id_usuario       = o.id_usuario
      LEFT JOIN crm_motivo_cierre mc    ON mc.id_motivo_cierre = o.id_motivo_cierre
     WHERE o.id_oportunidad = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 16. OPORTUNIDADES_ACTIVIDADES  (x01 = id_oportunidad)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_ACTIVIDADES
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT a.id_actividad  AS id,
           a.tipo,
           a.asunto,
           a.descripcion,
           a.resultado,
           a.virtual,
           a.fecha_actividad,
           a.fecha_creacion,
           u.nombre        AS ejecutivo,
           ub.latitud,
           ub.longitud
      FROM crm_actividad a
      JOIN crm_usuario u      ON u.id_usuario  = a.id_usuario
      LEFT JOIN crm_ubicacion ub ON ub.id_actividad = a.id_actividad
     WHERE a.id_oportunidad = l_id
     ORDER BY a.fecha_actividad DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 17. OPORTUNIDADES_CREATE
--     x01=titulo, x02=descripcion, x03=tipo_id, x04=valor_estimado,
--     x05=fecha_cierre (YYYY-MM-DD), x06=empresa_id
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_CREATE
DECLARE
  l_id          NUMBER;
  l_usuario_id  NUMBER;
  l_estado_id   NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  SELECT id_estado INTO l_estado_id
    FROM (SELECT id_estado FROM crm_estado_oportunidad WHERE tipo = 'ABIERTO' ORDER BY orden ASC)
   WHERE ROWNUM = 1;

  INSERT INTO crm_oportunidad (
    id_oportunidad, titulo, descripcion,
    id_tipo_oportunidad, id_estado_oportunidad,
    valor_estimado, fecha_cierre_estimada,
    fecha_creacion, fecha_actualizacion,
    id_empresa, id_usuario
  ) VALUES (
    crm_oportunidad_seq.NEXTVAL,
    APEX_APPLICATION.G_X01,
    APEX_APPLICATION.G_X02,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X03, '')),
    l_estado_id,
    TO_NUMBER(NULLIF(REPLACE(APEX_APPLICATION.G_X04, ',', '.'), '')),
    TO_DATE(NULLIF(APEX_APPLICATION.G_X05, ''), 'YYYY-MM-DD'),
    SYSDATE, SYSDATE,
    TO_NUMBER(NULLIF(APEX_APPLICATION.G_X06, '')),
    l_usuario_id
  ) RETURNING id_oportunidad INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id',      l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 18. OPORTUNIDADES_UPDATE
--     x01=id, x02=titulo, x03=descripcion, x04=tipo_id, x05=estado_id,
--     x06=valor_estimado, x07=fecha_cierre, x08=empresa_id
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_UPDATE
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_oportunidad
     SET titulo               = APEX_APPLICATION.G_X02,
         descripcion          = APEX_APPLICATION.G_X03,
         id_tipo_oportunidad  = TO_NUMBER(NULLIF(APEX_APPLICATION.G_X04, '')),
         id_estado_oportunidad= TO_NUMBER(NULLIF(APEX_APPLICATION.G_X05, '')),
         valor_estimado       = TO_NUMBER(NULLIF(REPLACE(APEX_APPLICATION.G_X06, ',', '.'), '')),
         fecha_cierre_estimada= TO_DATE(NULLIF(APEX_APPLICATION.G_X07, ''), 'YYYY-MM-DD'),
         id_empresa           = TO_NUMBER(NULLIF(APEX_APPLICATION.G_X08, '')),
         fecha_actualizacion  = SYSDATE
   WHERE id_oportunidad = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 19. OPORTUNIDADES_AVANZAR  (x01=id, x02=nombre_estado_nuevo)
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_AVANZAR
DECLARE
  l_id         NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_estado_id  NUMBER;
  l_usuario_id NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  SELECT id_estado INTO l_estado_id
    FROM crm_estado_oportunidad
   WHERE UPPER(nombre) = UPPER(APEX_APPLICATION.G_X02);

  INSERT INTO crm_historial_estado (
    id_historial, id_oportunidad,
    id_estado_anterior, id_estado_nuevo,
    fecha_cambio, id_usuario
  )
  SELECT crm_hist_opp_seq.NEXTVAL,
         l_id,
         id_estado_oportunidad,
         l_estado_id,
         SYSDATE,
         l_usuario_id
    FROM crm_oportunidad WHERE id_oportunidad = l_id;

  UPDATE crm_oportunidad
     SET id_estado_oportunidad = l_estado_id,
         fecha_actualizacion   = SYSDATE
   WHERE id_oportunidad = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 20. OPORTUNIDADES_CERRAR
--     x01=id, x02=nombre_estado (GANADA|PERDIDA),
--     x03=fecha_cierre (YYYY-MM-DD), x04=motivo_cierre_id
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_CERRAR
DECLARE
  l_id         NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
  l_estado_id  NUMBER;
  l_usuario_id NUMBER;
BEGIN
  SELECT id_usuario INTO l_usuario_id
    FROM crm_usuario
   WHERE UPPER(email) = UPPER(v('APP_USER')) AND activo = 1;

  SELECT id_estado INTO l_estado_id
    FROM crm_estado_oportunidad
   WHERE UPPER(nombre) = UPPER(APEX_APPLICATION.G_X02);

  INSERT INTO crm_historial_estado (
    id_historial, id_oportunidad,
    id_estado_anterior, id_estado_nuevo,
    fecha_cambio, id_usuario
  )
  SELECT crm_hist_opp_seq.NEXTVAL, l_id,
         id_estado_oportunidad, l_estado_id,
         SYSDATE, l_usuario_id
    FROM crm_oportunidad WHERE id_oportunidad = l_id;

  UPDATE crm_oportunidad
     SET id_estado_oportunidad = l_estado_id,
         fecha_cierre_estimada = TO_DATE(NULLIF(APEX_APPLICATION.G_X03,''), 'YYYY-MM-DD'),
         id_motivo_cierre      = TO_NUMBER(NULLIF(APEX_APPLICATION.G_X04, '')),
         fecha_actualizacion   = SYSDATE
   WHERE id_oportunidad = l_id;

  -- Si se gana, marcar empresa como no-nueva
  UPDATE crm_empresa
     SET nuevo = 0
   WHERE id_empresa = (SELECT id_empresa FROM crm_oportunidad WHERE id_oportunidad = l_id)
     AND UPPER(APEX_APPLICATION.G_X02) = 'GANADA';

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- 21. OPORTUNIDADES_ESTANCADAS  (x01 = días_sin_actividad, default 7)
--     Retorna oportunidades abiertas sin actividad en los últimos N días.
--     También incluye leads estancados para la vista del coordinador.
-- ─────────────────────────────────────────────────────────────────────────────
-- Process Name: OPORTUNIDADES_ESTANCADAS
DECLARE
  l_cur  SYS_REFCURSOR;
  l_dias NUMBER := NVL(TO_NUMBER(NULLIF(APEX_APPLICATION.G_X01,'')), 7);
BEGIN
  OPEN l_cur FOR
    -- Oportunidades abiertas sin actividad reciente
    SELECT 'OPP'                               AS tipo,
           o.id_oportunidad                    AS id,
           o.titulo,
           e.nombre                            AS empresa,
           eo.nombre                           AS estado,
           u.nombre                            AS ejecutivo,
           o.valor_estimado                    AS valor,
           TRUNC(SYSDATE - NVL(
             (SELECT MAX(a.fecha_actividad)
                FROM crm_actividad a
               WHERE a.id_oportunidad = o.id_oportunidad), o.fecha_creacion)) AS dias,
           l_dias                              AS umbral
      FROM crm_oportunidad o
      JOIN crm_estado_oportunidad eo ON eo.id_estado   = o.id_estado_oportunidad
      JOIN crm_usuario u             ON u.id_usuario   = o.id_usuario
      LEFT JOIN crm_empresa e        ON e.id_empresa   = o.id_empresa
     WHERE eo.tipo = 'ABIERTO'
       AND TRUNC(SYSDATE - NVL(
             (SELECT MAX(a.fecha_actividad)
                FROM crm_actividad a
               WHERE a.id_oportunidad = o.id_oportunidad), o.fecha_creacion)) >= l_dias
    UNION ALL
    -- Leads activos sin actividad reciente
    SELECT 'LEAD'                              AS tipo,
           l.id_lead                           AS id,
           l.titulo,
           l.nombre_empresa                   AS empresa,
           el.nombre                           AS estado,
           u.nombre                            AS ejecutivo,
           NULL                                AS valor,
           TRUNC(SYSDATE - NVL(
             (SELECT MAX(a.fecha_actividad)
                FROM crm_actividad a
               WHERE a.id_lead = l.id_lead), l.fecha_creacion)) AS dias,
           l_dias                              AS umbral
      FROM crm_lead l
      JOIN crm_estado_lead el ON el.id_estado_lead = l.id_estado_lead
      JOIN crm_usuario u      ON u.id_usuario      = l.id_usuario
     WHERE el.tipo = 'ABIERTO'
       AND l.id_oportunidad_generada IS NULL
       AND TRUNC(SYSDATE - NVL(
             (SELECT MAX(a.fecha_actividad)
                FROM crm_actividad a
               WHERE a.id_lead = l.id_lead), l.fecha_creacion)) >= l_dias
     ORDER BY dias DESC;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
/
