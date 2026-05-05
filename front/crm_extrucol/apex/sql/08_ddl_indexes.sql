-- =============================================================================
-- CRM EXTRUCOL — ÍNDICES DE RENDIMIENTO
-- Ejecutar DESPUÉS de 05_ddl_core.sql
-- Cubre: FKs sin índice automático, filtros frecuentes en los 54 procesos APEX.
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_USUARIO
-- ─────────────────────────────────────────────────────────────────────────────
-- Búsqueda case-insensitive del apex_username (crm_session_api.cargar_sesion)
CREATE INDEX crm_usuario_ix_apex_usr
  ON crm_usuario (UPPER(apex_username));

-- Búsqueda case-insensitive del email (fallback en crm_session_api)
CREATE INDEX crm_usuario_ix_email_upper
  ON crm_usuario (UPPER(email));

-- Filtros por rol y estado activo (USUARIOS_LIST, EQUIPO_LIST)
CREATE INDEX crm_usuario_ix_rol_activo
  ON crm_usuario (rol, activo);

-- FK hacia crm_departamento
CREATE INDEX crm_usuario_ix_depto
  ON crm_usuario (id_departamento);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_EMPRESA
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_empresa_ix_municipio  ON crm_empresa (id_municipio);
CREATE INDEX crm_empresa_ix_documento  ON crm_empresa (id_documento);
CREATE INDEX crm_empresa_ix_modalidad  ON crm_empresa (id_modalidad);
CREATE INDEX crm_empresa_ix_activo     ON crm_empresa (activo);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_CONTACTO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_contacto_ix_empresa   ON crm_contacto (id_empresa);
CREATE INDEX crm_contacto_ix_principal ON crm_contacto (id_empresa, es_principal);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_EMAIL / CRM_TELEFONO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_email_ix_contacto    ON crm_email (id_contacto);
CREATE INDEX crm_telefono_ix_contacto ON crm_telefono (id_contacto);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_LEAD
-- ─────────────────────────────────────────────────────────────────────────────
-- FKs
CREATE INDEX crm_lead_ix_usuario     ON crm_lead (id_usuario);
CREATE INDEX crm_lead_ix_estado      ON crm_lead (id_estado_lead);
CREATE INDEX crm_lead_ix_origen      ON crm_lead (id_origen_lead);
CREATE INDEX crm_lead_ix_opp_gen     ON crm_lead (id_oportunidad_generada);
CREATE INDEX crm_lead_ix_motivo_desc ON crm_lead (id_motivo_descalificacion);

-- Consultas más frecuentes: leads del usuario ordenados por fecha
CREATE INDEX crm_lead_ix_usu_fecha
  ON crm_lead (id_usuario, fecha_actualizacion DESC);

-- LEADS_LIST: kanban agrupado por estado
CREATE INDEX crm_lead_ix_usu_estado
  ON crm_lead (id_usuario, id_estado_lead);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_LEAD_INTERES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_lead_interes_ix_interes ON crm_lead_interes (id_interes);
-- id_lead ya indexado por la UK (id_lead, id_interes)


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_HISTORIAL_ESTADO_LEAD
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_hist_lead_ix_lead    ON crm_historial_estado_lead (id_lead, fecha_cambio DESC);
CREATE INDEX crm_hist_lead_ix_usuario ON crm_historial_estado_lead (id_usuario);
CREATE INDEX crm_hist_lead_ix_est_ant ON crm_historial_estado_lead (id_estado_anterior);
CREATE INDEX crm_hist_lead_ix_est_nvo ON crm_historial_estado_lead (id_estado_nuevo);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_OPORTUNIDAD
-- ─────────────────────────────────────────────────────────────────────────────
-- FKs
CREATE INDEX crm_opp_ix_usuario      ON crm_oportunidad (id_usuario);
CREATE INDEX crm_opp_ix_empresa      ON crm_oportunidad (id_empresa);
CREATE INDEX crm_opp_ix_estado       ON crm_oportunidad (id_estado_oportunidad);
CREATE INDEX crm_opp_ix_tipo         ON crm_oportunidad (id_tipo_oportunidad);
CREATE INDEX crm_opp_ix_sector       ON crm_oportunidad (id_sector);
CREATE INDEX crm_opp_ix_lead         ON crm_oportunidad (id_lead_origen);
CREATE INDEX crm_opp_ix_motivo       ON crm_oportunidad (id_motivo_cierre);

-- OPORTUNIDADES_ESTANCADAS: sin actividad reciente → filtro por fecha_actualizacion
CREATE INDEX crm_opp_ix_fecha_act
  ON crm_oportunidad (fecha_actualizacion);

-- Pipeline director: opps abiertas ordenadas por valor y cierre estimado
CREATE INDEX crm_opp_ix_estado_valor
  ON crm_oportunidad (id_estado_oportunidad, fecha_cierre_estimada, valor_estimado DESC);

-- Vista por ejecutivo + estado (OPORTUNIDADES_LIST)
CREATE INDEX crm_opp_ix_usu_estado
  ON crm_oportunidad (id_usuario, id_estado_oportunidad);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_OPORTUNIDAD_PRODUCTO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_opp_prod_ix_opp     ON crm_oportunidad_producto (id_oportunidad);
CREATE INDEX crm_opp_prod_ix_prod    ON crm_oportunidad_producto (id_producto);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_HISTORIAL_ESTADO  (pipeline oportunidades)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_hist_opp_ix_opp     ON crm_historial_estado (id_oportunidad, fecha_cambio DESC);
CREATE INDEX crm_hist_opp_ix_usuario ON crm_historial_estado (id_usuario);
CREATE INDEX crm_hist_opp_ix_est_ant ON crm_historial_estado (id_estado_anterior);
CREATE INDEX crm_hist_opp_ix_est_nvo ON crm_historial_estado (id_estado_nuevo);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_ACTIVIDAD
-- ─────────────────────────────────────────────────────────────────────────────
-- FKs
CREATE INDEX crm_actividad_ix_usuario ON crm_actividad (id_usuario);
CREATE INDEX crm_actividad_ix_opp     ON crm_actividad (id_oportunidad);
CREATE INDEX crm_actividad_ix_lead    ON crm_actividad (id_lead);

-- ACTIVIDADES_LIST_MIS / ACTIVIDADES_LIST_TODAS: filtro por rango de fechas
CREATE INDEX crm_actividad_ix_fecha
  ON crm_actividad (fecha_actividad);

-- Actividades del ejecutivo en un período (query más frecuente del calendario)
CREATE INDEX crm_actividad_ix_usu_fecha
  ON crm_actividad (id_usuario, fecha_actividad);

-- MONITOREO_ACTIVIDADES_MAPA: actividades presenciales de hoy
CREATE INDEX crm_actividad_ix_usu_virtual_fecha
  ON crm_actividad (id_usuario, virtual, fecha_actividad);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_PROYECTO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_proyecto_ix_usuario  ON crm_proyecto (id_usuario);
CREATE INDEX crm_proyecto_ix_opp      ON crm_proyecto (id_oportunidad);
CREATE INDEX crm_proyecto_ix_estado   ON crm_proyecto (estado);

-- Vista ejecutivo: mis proyectos activos
CREATE INDEX crm_proyecto_ix_usu_estado
  ON crm_proyecto (id_usuario, estado);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_PROYECTO_HITO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_hito_ix_proyecto ON crm_proyecto_hito (id_proyecto, orden);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_META
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_meta_ix_usuario    ON crm_meta (id_usuario);
CREATE INDEX crm_meta_ix_creado     ON crm_meta (id_creado_por);
CREATE INDEX crm_meta_ix_activo     ON crm_meta (activo);
CREATE INDEX crm_meta_ix_periodo    ON crm_meta (periodo, activo);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_CUMPLIMIENTO_META
-- ─────────────────────────────────────────────────────────────────────────────
-- La UK (id_meta, id_usuario, mes, anio) ya crea un índice único.
-- Índice adicional para METAS_CUMPLIMIENTO: todos los usuarios en un período
CREATE INDEX crm_cumplimiento_ix_periodo
  ON crm_cumplimiento_meta (mes, anio, id_usuario);

CREATE INDEX crm_cumplimiento_ix_usuario
  ON crm_cumplimiento_meta (id_usuario, mes, anio);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_NOTIFICACION
-- ─────────────────────────────────────────────────────────────────────────────
-- FKs
CREATE INDEX crm_notif_ix_origen   ON crm_notificacion (id_usuario_origen);
CREATE INDEX crm_notif_ix_lead     ON crm_notificacion (id_lead);
CREATE INDEX crm_notif_ix_opp      ON crm_notificacion (id_oportunidad);

-- ALERTAS_LIST: notificaciones no leídas del usuario (query más frecuente)
CREATE INDEX crm_notif_ix_destino_leida
  ON crm_notificacion (id_usuario_destino, leida, fecha_creacion DESC);

-- ALERTAS_LOG: log completo ordenado por fecha
CREATE INDEX crm_notif_ix_destino_fecha
  ON crm_notificacion (id_usuario_destino, fecha_creacion DESC);


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_AUDITORIA
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX crm_auditoria_ix_usuario   ON crm_auditoria (id_usuario);
CREATE INDEX crm_auditoria_ix_tabla_reg ON crm_auditoria (nombre_tabla, id_registro);
CREATE INDEX crm_auditoria_ix_fecha     ON crm_auditoria (fecha_registro DESC);


PROMPT ✓ Índices de rendimiento creados.
