-- =============================================================================
-- CRM EXTRUCOL — ESPECIFICACIONES DE PAQUETES PL/SQL
-- Ejecutar DESPUÉS de 06_ddl_packages.sql (crm_session_api)
-- Los procesos APEX (12_apex_processes_v2.sql) solo llaman estas specs.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_CATALOGS  —  datos de referencia y configuración
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_catalogs AS
  PROCEDURE p_ciudades_list (p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_config_get    (p_cur OUT SYS_REFCURSOR);
END pkg_catalogs;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_CLIENTES  —  CRM_EMPRESA + CRM_CONTACTO principal
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_clientes AS
  PROCEDURE p_list (p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_get  (p_id NUMBER, p_cur OUT SYS_REFCURSOR);
  -- x01=nombre x02=nit x03=id_municipio x04=id_documento x05=id_modalidad
  -- x06=contacto_nombre x07=contacto_cargo x08=contacto_email x09=contacto_tel
  PROCEDURE p_create (
    p_nombre      VARCHAR2, p_nit        VARCHAR2,
    p_municipio   NUMBER,   p_documento  NUMBER,   p_modalidad NUMBER,
    p_cto_nombre  VARCHAR2, p_cto_cargo  VARCHAR2,
    p_cto_email   VARCHAR2, p_cto_tel    VARCHAR2,
    p_id_out  OUT NUMBER
  );
  -- x01=id x02=nombre x03=nit x04=id_municipio x05=id_documento x06=id_modalidad
  PROCEDURE p_update (
    p_id        NUMBER,   p_nombre    VARCHAR2, p_nit       VARCHAR2,
    p_municipio NUMBER,   p_documento NUMBER,   p_modalidad NUMBER
  );
END pkg_clientes;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_LEADS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_leads AS
  PROCEDURE p_list     (p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_get      (p_id NUMBER, p_cur OUT SYS_REFCURSOR);
  -- x01=titulo x02=descripcion x03=id_origen_lead x04=id_estado_lead
  -- x05=nombre_empresa x06=nombre_contacto x07=telefono x08=email x09=score
  PROCEDURE p_create (
    p_titulo       VARCHAR2, p_descripcion   VARCHAR2,
    p_origen       NUMBER,   p_estado        NUMBER,
    p_nombre_emp   VARCHAR2, p_nombre_cto    VARCHAR2,
    p_telefono     VARCHAR2, p_email         VARCHAR2,
    p_score        NUMBER,
    p_id_out   OUT NUMBER
  );
  -- x01=id x02=titulo x03=descripcion x04=id_estado_lead x05=score
  -- x06=nombre_empresa x07=nombre_contacto x08=telefono x09=email
  PROCEDURE p_update (
    p_id           NUMBER,   p_titulo       VARCHAR2, p_descripcion VARCHAR2,
    p_estado       NUMBER,   p_score        NUMBER,
    p_nombre_emp   VARCHAR2, p_nombre_cto   VARCHAR2,
    p_telefono     VARCHAR2, p_email        VARCHAR2
  );
  -- x01=id_lead x02=id_estado_lead x03=comentario
  PROCEDURE p_estado (p_id NUMBER, p_estado NUMBER, p_comentario VARCHAR2);
  -- x01=id_lead x02=titulo_opp x03=valor_estimado x04=fecha_cierre x05=id_tipo
  PROCEDURE p_convertir (
    p_id        NUMBER, p_titulo    VARCHAR2, p_valor      NUMBER,
    p_fecha_cie VARCHAR2, p_tipo    NUMBER,
    p_id_opp_out OUT NUMBER
  );
END pkg_leads;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_OPORTUNIDADES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_oportunidades AS
  PROCEDURE p_list        (p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_list_todas  (p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_get         (p_id NUMBER, p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_actividades (p_id NUMBER, p_cur OUT SYS_REFCURSOR);
  -- x01=titulo x02=descripcion x03=id_tipo x04=valor_estimado
  -- x05=fecha_cierre x06=id_empresa x07=id_sector x08=probabilidad
  PROCEDURE p_create (
    p_titulo     VARCHAR2, p_descripcion VARCHAR2,
    p_tipo       NUMBER,   p_valor       NUMBER,
    p_fecha_cie  VARCHAR2, p_empresa     NUMBER,
    p_sector     NUMBER,   p_prob        NUMBER,
    p_id_out OUT NUMBER
  );
  -- x01=id x02=titulo x03=descripcion x04=id_tipo x05=valor
  -- x06=fecha_cierre x07=id_empresa x08=id_sector x09=probabilidad x10=id_estado
  PROCEDURE p_update (
    p_id         NUMBER,   p_titulo      VARCHAR2, p_descripcion VARCHAR2,
    p_tipo       NUMBER,   p_valor       NUMBER,   p_fecha_cie   VARCHAR2,
    p_empresa    NUMBER,   p_sector      NUMBER,   p_prob        NUMBER,
    p_estado     NUMBER
  );
  -- x01=id_oportunidad x02=id_estado_nuevo x03=comentario
  PROCEDURE p_avanzar   (p_id NUMBER, p_estado NUMBER, p_comentario VARCHAR2);
  -- x01=id x02=id_estado(105/106) x03=id_motivo x04=descripcion_cierre x05=fecha_cierre
  PROCEDURE p_cerrar    (p_id NUMBER, p_estado NUMBER, p_motivo NUMBER,
                         p_desc_cierre VARCHAR2, p_fecha_cie VARCHAR2);
  -- x01=dias_sin_actividad (default 7)
  PROCEDURE p_estancadas (p_dias NUMBER, p_cur OUT SYS_REFCURSOR);
END pkg_oportunidades;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_ACTIVIDADES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_actividades AS
  -- x01=fecha_inicio(YYYY-MM-DD, null=mes actual) x02=fecha_fin
  PROCEDURE p_list_mis   (p_inicio VARCHAR2, p_fin VARCHAR2, p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_list_todas (p_inicio VARCHAR2, p_fin VARCHAR2, p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_get        (p_id NUMBER, p_cur OUT SYS_REFCURSOR);
  -- x01=tipo x02=asunto x03=descripcion x04=virtual(0/1)
  -- x05=fecha_actividad x06=id_oportunidad x07=id_lead
  PROCEDURE p_create (
    p_tipo    VARCHAR2, p_asunto      VARCHAR2, p_descripcion VARCHAR2,
    p_virtual NUMBER,   p_fecha_acti  VARCHAR2,
    p_opp     NUMBER,   p_lead        NUMBER,
    p_id_out OUT NUMBER
  );
  -- x01=id x02=tipo x03=asunto x04=descripcion x05=virtual x06=fecha_actividad
  PROCEDURE p_update (
    p_id      NUMBER,   p_tipo    VARCHAR2, p_asunto  VARCHAR2,
    p_desc    VARCHAR2, p_virtual NUMBER,   p_fecha   VARCHAR2
  );
  -- x01=id x02=resultado x03=latitud x04=longitud
  PROCEDURE p_cerrar (p_id NUMBER, p_resultado VARCHAR2,
                      p_lat VARCHAR2, p_lon VARCHAR2);
END pkg_actividades;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_PROYECTOS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_proyectos AS
  PROCEDURE p_list      (p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_list_todos(p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_get       (p_id NUMBER, p_cur OUT SYS_REFCURSOR);
  -- x01=nombre x02=descripcion x03=id_oportunidad x04=fecha_inicio x05=fecha_fin
  PROCEDURE p_create (
    p_nombre  VARCHAR2, p_descripcion VARCHAR2, p_opp NUMBER,
    p_inicio  VARCHAR2, p_fin         VARCHAR2,
    p_id_out OUT NUMBER
  );
  -- x01=id x02=nombre x03=descripcion x04=porcentaje x05=fecha_inicio x06=fecha_fin
  PROCEDURE p_update (
    p_id     NUMBER,   p_nombre VARCHAR2, p_desc VARCHAR2,
    p_pct    NUMBER,   p_inicio VARCHAR2, p_fin  VARCHAR2
  );
  -- x01=id_proyecto x02=estado(PLANIFICACION|EN_EJECUCION|EN_PAUSA|ENTREGADO)
  PROCEDURE p_estado (p_id NUMBER, p_estado VARCHAR2);
END pkg_proyectos;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_USUARIOS  —  solo ADMINISTRADOR / DIRECTOR pueden crear y editar
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_usuarios AS
  PROCEDURE p_list   (p_cur OUT SYS_REFCURSOR);
  PROCEDURE p_get    (p_id NUMBER, p_cur OUT SYS_REFCURSOR);
  -- x01=nombre x02=email x03=rol x04=id_departamento x05=apex_username
  PROCEDURE p_create (
    p_nombre VARCHAR2, p_email VARCHAR2, p_rol VARCHAR2,
    p_depto  NUMBER,   p_apex  VARCHAR2,
    p_id_out OUT NUMBER
  );
  -- x01=id x02=nombre x03=email x04=rol x05=id_departamento x06=apex_username
  PROCEDURE p_update (
    p_id    NUMBER,   p_nombre VARCHAR2, p_email VARCHAR2,
    p_rol   VARCHAR2, p_depto  NUMBER,   p_apex  VARCHAR2
  );
  -- x01=id_usuario x02=activo(0/1)
  PROCEDURE p_estado (p_id NUMBER, p_activo NUMBER);
END pkg_usuarios;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_DASHBOARD  —  construye el JSON completo dentro del paquete
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_dashboard AS
  PROCEDURE p_ejecutivo;
  PROCEDURE p_coordinador;
END pkg_dashboard;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_METAS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_metas AS
  PROCEDURE p_mis_metas    (p_cur OUT SYS_REFCURSOR);
  -- x01=mes x02=anio
  PROCEDURE p_cumplimiento (p_mes NUMBER, p_anio NUMBER, p_cur OUT SYS_REFCURSOR);
END pkg_metas;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_ALERTAS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_alertas AS
  PROCEDURE p_list         (p_cur OUT SYS_REFCURSOR);
  -- x01=fecha_inicio x02=fecha_fin
  PROCEDURE p_log          (p_inicio VARCHAR2, p_fin VARCHAR2, p_cur OUT SYS_REFCURSOR);
  -- x01=id_notificacion
  PROCEDURE p_marcar_leida (p_id NUMBER);
END pkg_alertas;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_EQUIPO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_equipo AS
  PROCEDURE p_list          (p_cur OUT SYS_REFCURSOR);
  -- x01=id_usuario
  PROCEDURE p_get_ejecutivo (p_id NUMBER, p_cur OUT SYS_REFCURSOR);
END pkg_equipo;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_MONITOREO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_monitoreo AS
  PROCEDURE p_ejecutivos_gps     (p_cur OUT SYS_REFCURSOR);
  -- x01=fecha(YYYY-MM-DD)
  PROCEDURE p_actividades_mapa   (p_fecha VARCHAR2, p_cur OUT SYS_REFCURSOR);
END pkg_monitoreo;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_ANALISIS  —  construye JSON complejo dentro del paquete
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_analisis AS
  -- x01=mes x02=anio
  PROCEDURE p_sectores  (p_mes NUMBER, p_anio NUMBER);
  -- x01=meses (número de meses a proyectar, default 3)
  PROCEDURE p_forecast  (p_meses NUMBER);
END pkg_analisis;
/

-- ─────────────────────────────────────────────────────────────────────────────
-- PKG_REPORTES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE pkg_reportes AS
  PROCEDURE p_list (p_cur OUT SYS_REFCURSOR);
  -- x01=tipo x02=fecha_inicio(YYYY-MM-DD) x03=fecha_fin
  PROCEDURE p_generar (p_tipo VARCHAR2, p_inicio VARCHAR2, p_fin VARCHAR2);
END pkg_reportes;
/

PROMPT ✓ Package specs creadas (13 paquetes).
