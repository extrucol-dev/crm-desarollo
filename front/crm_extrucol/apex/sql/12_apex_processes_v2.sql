-- =============================================================================
-- CRM EXTRUCOL — APEX Application Processes v2 (thin wrappers)
-- Cada proceso solo: parsea x01-x10, llama al paquete, cierra JSON.
-- Toda la lógica SQL vive en los packages (11a / 11b).
--
-- Reemplaza: 01_apex_processes_part1.sql y 02_apex_processes_part2.sql
--
-- Configuración en APEX Builder:
--   Shared Components → Application Processes → Create
--   Point  : On Demand
--   Type   : PL/SQL Anonymous Block
--   Copiar el bloque BEGIN…END; del proceso correspondiente.
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- SESIÓN / USUARIO
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: USUARIO_ACTUAL
DECLARE
  l_id     NUMBER;
  l_nombre VARCHAR2(200);
  l_rol    VARCHAR2(20);
BEGIN
  l_id     := crm_session_api.get_usuario_id;
  l_rol    := crm_session_api.get_rol;
  crm_session_api.registrar_acceso;
  SELECT nombre INTO l_nombre FROM crm_usuario WHERE id_usuario = l_id;
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('id',     l_id);
    APEX_JSON.WRITE('nombre', l_nombre);
    APEX_JSON.WRITE('rol',    l_rol);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CATÁLOGOS
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: CIUDADES_LIST
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_catalogs.p_ciudades_list(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: CONFIGURACION_GET
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_catalogs.p_config_get(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CLIENTES  (x01=nombre x02=nit x03=municipio x04=documento x05=modalidad
--             x06=cto_nombre x07=cto_cargo x08=cto_email x09=cto_tel)
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: CLIENTES_LIST
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_clientes.p_list(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: CLIENTES_GET  (x01=id_empresa)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_clientes.p_get(TO_NUMBER(apex_application.g_x01), l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: CLIENTES_CREATE
DECLARE l_id NUMBER; BEGIN
  pkg_clientes.p_create(
    apex_application.g_x01, apex_application.g_x02,
    TO_NUMBER(apex_application.g_x03), TO_NUMBER(apex_application.g_x04),
    TO_NUMBER(apex_application.g_x05),
    apex_application.g_x06, apex_application.g_x07,
    apex_application.g_x08, apex_application.g_x09,
    l_id
  );
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('id',      l_id);
    APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: CLIENTES_UPDATE  (x01=id x02=nombre x03=nit x04=municipio x05=documento x06=modalidad)
BEGIN
  pkg_clientes.p_update(
    TO_NUMBER(apex_application.g_x01), apex_application.g_x02, apex_application.g_x03,
    TO_NUMBER(apex_application.g_x04), TO_NUMBER(apex_application.g_x05),
    TO_NUMBER(apex_application.g_x06)
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- LEADS  (x01=titulo x02=desc x03=origen x04=estado x05=emp x06=cto x07=tel x08=email x09=score)
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: LEADS_LIST
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_leads.p_list(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: LEADS_GET  (x01=id_lead)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_leads.p_get(TO_NUMBER(apex_application.g_x01), l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: LEADS_CREATE
DECLARE l_id NUMBER; BEGIN
  pkg_leads.p_create(
    apex_application.g_x01, apex_application.g_x02,
    TO_NUMBER(apex_application.g_x03), TO_NUMBER(apex_application.g_x04),
    apex_application.g_x05, apex_application.g_x06,
    apex_application.g_x07, apex_application.g_x08,
    TO_NUMBER(apex_application.g_x09),
    l_id
  );
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('id', l_id); APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: LEADS_UPDATE  (x01=id x02=titulo x03=desc x04=estado x05=score x06=emp x07=cto x08=tel x09=email)
BEGIN
  pkg_leads.p_update(
    TO_NUMBER(apex_application.g_x01),
    apex_application.g_x02, apex_application.g_x03,
    TO_NUMBER(apex_application.g_x04), TO_NUMBER(apex_application.g_x05),
    apex_application.g_x06, apex_application.g_x07,
    apex_application.g_x08, apex_application.g_x09
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: LEADS_ESTADO  (x01=id_lead x02=id_estado x03=comentario)
BEGIN
  pkg_leads.p_estado(
    TO_NUMBER(apex_application.g_x01),
    TO_NUMBER(apex_application.g_x02),
    apex_application.g_x03
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: LEADS_CONVERTIR  (x01=id_lead x02=titulo_opp x03=valor x04=fecha_cierre x05=id_tipo)
DECLARE l_opp_id NUMBER; BEGIN
  pkg_leads.p_convertir(
    TO_NUMBER(apex_application.g_x01), apex_application.g_x02,
    TO_NUMBER(apex_application.g_x03), apex_application.g_x04,
    TO_NUMBER(apex_application.g_x05),
    l_opp_id
  );
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('id_oportunidad', l_opp_id);
    APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- OPORTUNIDADES
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: OPORTUNIDADES_LIST
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_oportunidades.p_list(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: OPORTUNIDADES_LIST_TODAS
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_oportunidades.p_list_todas(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: OPORTUNIDADES_GET  (x01=id_oportunidad)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_oportunidades.p_get(TO_NUMBER(apex_application.g_x01), l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: OPORTUNIDADES_ACTIVIDADES  (x01=id_oportunidad)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_oportunidades.p_actividades(TO_NUMBER(apex_application.g_x01), l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: OPORTUNIDADES_CREATE  (x01=titulo x02=desc x03=tipo x04=valor x05=fecha_cie x06=empresa x07=sector x08=prob)
DECLARE l_id NUMBER; BEGIN
  pkg_oportunidades.p_create(
    apex_application.g_x01, apex_application.g_x02,
    TO_NUMBER(apex_application.g_x03), TO_NUMBER(apex_application.g_x04),
    apex_application.g_x05,
    TO_NUMBER(apex_application.g_x06), TO_NUMBER(apex_application.g_x07),
    TO_NUMBER(apex_application.g_x08),
    l_id
  );
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('id', l_id); APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: OPORTUNIDADES_UPDATE  (x01=id x02=titulo x03=desc x04=tipo x05=valor x06=fecha x07=empresa x08=sector x09=prob x10=estado)
BEGIN
  pkg_oportunidades.p_update(
    TO_NUMBER(apex_application.g_x01),
    apex_application.g_x02, apex_application.g_x03,
    TO_NUMBER(apex_application.g_x04), TO_NUMBER(apex_application.g_x05),
    apex_application.g_x06,
    TO_NUMBER(apex_application.g_x07), TO_NUMBER(apex_application.g_x08),
    TO_NUMBER(apex_application.g_x09), TO_NUMBER(apex_application.g_x10)
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: OPORTUNIDADES_AVANZAR  (x01=id x02=id_estado_nuevo x03=comentario)
BEGIN
  pkg_oportunidades.p_avanzar(
    TO_NUMBER(apex_application.g_x01),
    TO_NUMBER(apex_application.g_x02),
    apex_application.g_x03
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: OPORTUNIDADES_CERRAR  (x01=id x02=id_estado(105/106) x03=id_motivo x04=desc_cierre x05=fecha_cierre)
BEGIN
  pkg_oportunidades.p_cerrar(
    TO_NUMBER(apex_application.g_x01), TO_NUMBER(apex_application.g_x02),
    TO_NUMBER(apex_application.g_x03), apex_application.g_x04,
    apex_application.g_x05
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: OPORTUNIDADES_ESTANCADAS  (x01=dias_sin_actividad, default 7)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_oportunidades.p_estancadas(TO_NUMBER(apex_application.g_x01), l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- ACTIVIDADES  (x01=tipo x02=asunto x03=desc x04=virtual x05=fecha x06=opp x07=lead)
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: ACTIVIDADES_LIST_MIS  (x01=fecha_inicio x02=fecha_fin, ambas opcionales)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_actividades.p_list_mis(apex_application.g_x01, apex_application.g_x02, l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: ACTIVIDADES_LIST_TODAS  (x01=fecha_inicio x02=fecha_fin)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_actividades.p_list_todas(apex_application.g_x01, apex_application.g_x02, l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: ACTIVIDADES_GET  (x01=id_actividad)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_actividades.p_get(TO_NUMBER(apex_application.g_x01), l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: ACTIVIDADES_CREATE
DECLARE l_id NUMBER; BEGIN
  pkg_actividades.p_create(
    apex_application.g_x01, apex_application.g_x02, apex_application.g_x03,
    TO_NUMBER(apex_application.g_x04), apex_application.g_x05,
    TO_NUMBER(apex_application.g_x06), TO_NUMBER(apex_application.g_x07),
    l_id
  );
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('id', l_id); APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: ACTIVIDADES_UPDATE  (x01=id x02=tipo x03=asunto x04=desc x05=virtual x06=fecha)
BEGIN
  pkg_actividades.p_update(
    TO_NUMBER(apex_application.g_x01),
    apex_application.g_x02, apex_application.g_x03, apex_application.g_x04,
    TO_NUMBER(apex_application.g_x05), apex_application.g_x06
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: ACTIVIDADES_CERRAR  (x01=id x02=resultado x03=latitud x04=longitud)
BEGIN
  pkg_actividades.p_cerrar(
    TO_NUMBER(apex_application.g_x01), apex_application.g_x02,
    apex_application.g_x03, apex_application.g_x04
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- PROYECTOS  (x01=nombre x02=desc x03=id_opp x04=fecha_ini x05=fecha_fin)
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: PROYECTOS_LIST
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_proyectos.p_list(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: PROYECTOS_LIST_TODOS
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_proyectos.p_list_todos(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: PROYECTOS_GET  (x01=id_proyecto)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_proyectos.p_get(TO_NUMBER(apex_application.g_x01), l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: PROYECTOS_CREATE
DECLARE l_id NUMBER; BEGIN
  pkg_proyectos.p_create(
    apex_application.g_x01, apex_application.g_x02,
    TO_NUMBER(apex_application.g_x03),
    apex_application.g_x04, apex_application.g_x05,
    l_id
  );
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('id', l_id); APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: PROYECTOS_UPDATE  (x01=id x02=nombre x03=desc x04=pct x05=fecha_ini x06=fecha_fin)
BEGIN
  pkg_proyectos.p_update(
    TO_NUMBER(apex_application.g_x01),
    apex_application.g_x02, apex_application.g_x03,
    TO_NUMBER(apex_application.g_x04),
    apex_application.g_x05, apex_application.g_x06
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: PROYECTOS_ESTADO  (x01=id_proyecto x02=estado)
BEGIN
  pkg_proyectos.p_estado(TO_NUMBER(apex_application.g_x01), apex_application.g_x02);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- USUARIOS  (x01=nombre x02=email x03=rol x04=id_depto x05=apex_username)
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: USUARIOS_LIST
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_usuarios.p_list(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: USUARIOS_GET  (x01=id_usuario)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_usuarios.p_get(TO_NUMBER(apex_application.g_x01), l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: USUARIOS_CREATE
DECLARE l_id NUMBER; BEGIN
  pkg_usuarios.p_create(
    apex_application.g_x01, apex_application.g_x02, apex_application.g_x03,
    TO_NUMBER(apex_application.g_x04), apex_application.g_x05,
    l_id
  );
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('id', l_id); APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: USUARIOS_UPDATE  (x01=id x02=nombre x03=email x04=rol x05=id_depto x06=apex_username)
BEGIN
  pkg_usuarios.p_update(
    TO_NUMBER(apex_application.g_x01),
    apex_application.g_x02, apex_application.g_x03, apex_application.g_x04,
    TO_NUMBER(apex_application.g_x05), apex_application.g_x06
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: USUARIOS_ESTADO  (x01=id_usuario x02=activo 0/1)
BEGIN
  pkg_usuarios.p_estado(TO_NUMBER(apex_application.g_x01), TO_NUMBER(apex_application.g_x02));
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- DASHBOARD  (sin parámetros; el paquete construye todo el JSON)
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: DASHBOARD_EJECUTIVO
BEGIN pkg_dashboard.p_ejecutivo; END;
/

-- Process: DASHBOARD_COORDINADOR
BEGIN pkg_dashboard.p_coordinador; END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- METAS
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: METAS_MIS_METAS
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_metas.p_mis_metas(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: METAS_CUMPLIMIENTO  (x01=mes x02=anio, ambos opcionales = mes actual)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_metas.p_cumplimiento(
    TO_NUMBER(apex_application.g_x01),
    TO_NUMBER(apex_application.g_x02),
    l_cur
  );
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- ALERTAS  (x01=id_notificacion para MARCAR_LEIDA)
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: ALERTAS_LIST
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_alertas.p_list(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: ALERTAS_LOG  (x01=fecha_inicio x02=fecha_fin)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_alertas.p_log(apex_application.g_x01, apex_application.g_x02, l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: ALERTAS_MARCAR_LEIDA  (x01=id_notificacion)
BEGIN
  pkg_alertas.p_marcar_leida(TO_NUMBER(apex_application.g_x01));
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('success', TRUE); APEX_JSON.CLOSE_OBJECT;
EXCEPTION WHEN OTHERS THEN
  APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE); APEX_JSON.WRITE('error', SQLERRM);
  APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- EQUIPO
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: EQUIPO_LIST
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_equipo.p_list(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: EQUIPO_GET_EJECUTIVO  (x01=id_usuario)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_equipo.p_get_ejecutivo(TO_NUMBER(apex_application.g_x01), l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- MONITOREO
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: MONITOREO_EJECUTIVOS
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_monitoreo.p_ejecutivos_gps(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: MONITOREO_ACTIVIDADES_MAPA  (x01=fecha YYYY-MM-DD, null=hoy)
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_monitoreo.p_actividades_mapa(apex_application.g_x01, l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- ANÁLISIS  (el paquete construye el JSON completo)
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: ANALISIS_SECTORES  (x01=mes x02=anio, null=acumulado)
BEGIN
  pkg_analisis.p_sectores(
    TO_NUMBER(apex_application.g_x01),
    TO_NUMBER(apex_application.g_x02)
  );
END;
/

-- Process: ANALISIS_FORECAST  (x01=meses, null=3)
BEGIN
  pkg_analisis.p_forecast(TO_NUMBER(apex_application.g_x01));
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- REPORTES  (x01=tipo x02=fecha_inicio x03=fecha_fin)
-- ─────────────────────────────────────────────────────────────────────────────

-- Process: REPORTES_LIST
DECLARE l_cur SYS_REFCURSOR; BEGIN
  pkg_reportes.p_list(l_cur);
  APEX_JSON.OPEN_OBJECT; APEX_JSON.WRITE('data', l_cur); APEX_JSON.CLOSE_OBJECT;
END;
/

-- Process: REPORTES_GENERAR
BEGIN
  pkg_reportes.p_generar(
    apex_application.g_x01,
    apex_application.g_x02,
    apex_application.g_x03
  );
END;
/

PROMPT ✓ Procesos thin v2 listos. Registrar cada bloque en APEX Builder → Application Processes.
PROMPT   Total: 44 procesos. Orden de ejecución SQL:
PROMPT   10 → 11a → 11b → 12 (registrar procesos en APEX Builder manualmente)
