-- =============================================================================
-- CRM EXTRUCOL — DDL TABLAS CORE (entidades principales)
-- Depende de: 04_ddl_catalogs.sql
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_USUARIO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_usuario_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_usuario (
  id_usuario       NUMBER        NOT NULL,
  nombre           VARCHAR2(200) NOT NULL,
  email            VARCHAR2(200) NOT NULL,
  password         VARCHAR2(500) NOT NULL,  -- hash bcrypt en REST; 'APEX_MANAGED' en APEX mode
  rol              VARCHAR2(20)  NOT NULL,
  activo           NUMBER(1)     DEFAULT 1 NOT NULL,
  fecha_creacion   DATE          DEFAULT SYSDATE NOT NULL,
  ultimo_acceso    DATE,
  id_departamento  NUMBER,
  CONSTRAINT crm_usuario_pk       PRIMARY KEY (id_usuario),
  CONSTRAINT crm_usuario_uk_email UNIQUE (email),
  CONSTRAINT crm_usuario_ck_rol   CHECK (rol IN ('EJECUTIVO','COORDINADOR','DIRECTOR','ADMINISTRADOR')),
  CONSTRAINT crm_usuario_ck_activo CHECK (activo IN (0,1)),
  CONSTRAINT crm_usuario_fk_depto FOREIGN KEY (id_departamento)
    REFERENCES crm_departamento (id_departamento)
);

CREATE OR REPLACE TRIGGER trg_crm_usuario_bi
  BEFORE INSERT ON crm_usuario FOR EACH ROW
BEGIN
  IF :NEW.id_usuario IS NULL THEN
    :NEW.id_usuario := crm_usuario_seq.NEXTVAL;
  END IF;
  :NEW.email          := LOWER(:NEW.email);
  :NEW.fecha_creacion := NVL(:NEW.fecha_creacion, SYSDATE);
END;
/

CREATE OR REPLACE TRIGGER trg_crm_usuario_bu
  BEFORE UPDATE ON crm_usuario FOR EACH ROW
BEGIN
  :NEW.email := LOWER(:NEW.email);
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_EMPRESA
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_empresa_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_empresa (
  id_empresa     NUMBER        NOT NULL,
  nombre         VARCHAR2(300) NOT NULL,
  no_documento   VARCHAR2(30),
  activo         NUMBER(1)     DEFAULT 1 NOT NULL,
  nuevo          NUMBER(1)     DEFAULT 1 NOT NULL,   -- false al ganar primera oportunidad
  fecha_creacion DATE          DEFAULT SYSDATE NOT NULL,
  id_municipio   NUMBER,
  id_documento   NUMBER,
  id_modalidad   NUMBER,
  CONSTRAINT crm_empresa_pk          PRIMARY KEY (id_empresa),
  CONSTRAINT crm_empresa_ck_activo   CHECK (activo IN (0,1)),
  CONSTRAINT crm_empresa_ck_nuevo    CHECK (nuevo IN (0,1)),
  CONSTRAINT crm_empresa_fk_municipio FOREIGN KEY (id_municipio)  REFERENCES crm_municipio (id_municipio),
  CONSTRAINT crm_empresa_fk_doc       FOREIGN KEY (id_documento)  REFERENCES crm_documento (id_documento),
  CONSTRAINT crm_empresa_fk_modal     FOREIGN KEY (id_modalidad)  REFERENCES crm_modalidad (id_modalidad)
);

CREATE OR REPLACE TRIGGER trg_crm_empresa_bi
  BEFORE INSERT ON crm_empresa FOR EACH ROW
BEGIN
  IF :NEW.id_empresa IS NULL THEN
    :NEW.id_empresa := crm_empresa_seq.NEXTVAL;
  END IF;
  :NEW.fecha_creacion := NVL(:NEW.fecha_creacion, SYSDATE);
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_CONTACTO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_contacto_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_contacto (
  id_contacto    NUMBER        NOT NULL,
  nombre         VARCHAR2(200) NOT NULL,
  apellido       VARCHAR2(200),
  cargo          VARCHAR2(100),
  es_principal   NUMBER(1)     DEFAULT 0 NOT NULL,
  activo         NUMBER(1)     DEFAULT 1 NOT NULL,
  fecha_creacion DATE          DEFAULT SYSDATE NOT NULL,
  id_empresa     NUMBER        NOT NULL,
  CONSTRAINT crm_contacto_pk           PRIMARY KEY (id_contacto),
  CONSTRAINT crm_contacto_ck_principal CHECK (es_principal IN (0,1)),
  CONSTRAINT crm_contacto_ck_activo    CHECK (activo IN (0,1)),
  CONSTRAINT crm_contacto_fk_empresa   FOREIGN KEY (id_empresa) REFERENCES crm_empresa (id_empresa)
);

CREATE OR REPLACE TRIGGER trg_crm_contacto_bi
  BEFORE INSERT ON crm_contacto FOR EACH ROW
BEGIN
  IF :NEW.id_contacto IS NULL THEN
    :NEW.id_contacto := crm_contacto_seq.NEXTVAL;
  END IF;
  :NEW.fecha_creacion := NVL(:NEW.fecha_creacion, SYSDATE);
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_EMAIL
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_email_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_email (
  id_email    NUMBER        NOT NULL,
  email       VARCHAR2(200) NOT NULL,
  id_contacto NUMBER        NOT NULL,
  CONSTRAINT crm_email_pk         PRIMARY KEY (id_email),
  CONSTRAINT crm_email_uk_email   UNIQUE (email),
  CONSTRAINT crm_email_fk_contacto FOREIGN KEY (id_contacto) REFERENCES crm_contacto (id_contacto)
);

CREATE OR REPLACE TRIGGER trg_crm_email_bi
  BEFORE INSERT ON crm_email FOR EACH ROW
BEGIN
  IF :NEW.id_email IS NULL THEN
    :NEW.id_email := crm_email_seq.NEXTVAL;
  END IF;
  :NEW.email := LOWER(:NEW.email);
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_TELEFONO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_telefono_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_telefono (
  id_telefono NUMBER       NOT NULL,
  numero      VARCHAR2(30) NOT NULL,
  id_contacto NUMBER       NOT NULL,
  CONSTRAINT crm_telefono_pk           PRIMARY KEY (id_telefono),
  CONSTRAINT crm_telefono_fk_contacto  FOREIGN KEY (id_contacto) REFERENCES crm_contacto (id_contacto)
);

CREATE OR REPLACE TRIGGER trg_crm_telefono_bi
  BEFORE INSERT ON crm_telefono FOR EACH ROW
BEGIN
  IF :NEW.id_telefono IS NULL THEN
    :NEW.id_telefono := crm_telefono_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_LEAD
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_lead_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_lead (
  id_lead                    NUMBER        NOT NULL,
  titulo                     VARCHAR2(300) NOT NULL,
  descripcion                CLOB,
  score                      NUMBER(3)     DEFAULT 0,
  id_estado_lead             NUMBER        NOT NULL,
  id_origen_lead             NUMBER        NOT NULL,
  fecha_creacion             DATE          DEFAULT SYSDATE NOT NULL,
  fecha_actualizacion        DATE          DEFAULT SYSDATE NOT NULL,
  nombre_empresa             VARCHAR2(300),
  nombre_contacto            VARCHAR2(200),
  telefono_contacto          VARCHAR2(30),
  email_contacto             VARCHAR2(200),
  id_usuario                 NUMBER        NOT NULL,
  id_oportunidad_generada    NUMBER,                -- FK diferida (se llena al convertir)
  id_motivo_descalificacion  NUMBER,
  motivo_descalificacion_obs VARCHAR2(1000),
  CONSTRAINT crm_lead_pk               PRIMARY KEY (id_lead),
  CONSTRAINT crm_lead_ck_score         CHECK (score BETWEEN 0 AND 100),
  CONSTRAINT crm_lead_fk_estado        FOREIGN KEY (id_estado_lead)
    REFERENCES crm_estado_lead (id_estado_lead),
  CONSTRAINT crm_lead_fk_origen        FOREIGN KEY (id_origen_lead)
    REFERENCES crm_origen_lead (id_origen_lead),
  CONSTRAINT crm_lead_fk_usuario       FOREIGN KEY (id_usuario)
    REFERENCES crm_usuario (id_usuario),
  CONSTRAINT crm_lead_fk_motivo        FOREIGN KEY (id_motivo_descalificacion)
    REFERENCES crm_motivo_descalificacion (id_motivo_descalificacion)
);

CREATE OR REPLACE TRIGGER trg_crm_lead_bi
  BEFORE INSERT ON crm_lead FOR EACH ROW
BEGIN
  IF :NEW.id_lead IS NULL THEN
    :NEW.id_lead := crm_lead_seq.NEXTVAL;
  END IF;
  :NEW.fecha_creacion      := NVL(:NEW.fecha_creacion, SYSDATE);
  :NEW.fecha_actualizacion := SYSDATE;
END;
/

CREATE OR REPLACE TRIGGER trg_crm_lead_bu
  BEFORE UPDATE ON crm_lead FOR EACH ROW
BEGIN
  :NEW.fecha_actualizacion := SYSDATE;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_LEAD_INTERES  (N:M lead ↔ interes)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_lead_interes_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_lead_interes (
  id_lead_interes NUMBER NOT NULL,
  id_lead         NUMBER NOT NULL,
  id_interes      NUMBER NOT NULL,
  fecha_registro  DATE   DEFAULT SYSDATE NOT NULL,
  CONSTRAINT crm_lead_interes_pk      PRIMARY KEY (id_lead_interes),
  CONSTRAINT crm_lead_interes_uk      UNIQUE (id_lead, id_interes),
  CONSTRAINT crm_lead_interes_fk_lead FOREIGN KEY (id_lead)    REFERENCES crm_lead (id_lead),
  CONSTRAINT crm_lead_interes_fk_int  FOREIGN KEY (id_interes) REFERENCES crm_interes (id_interes)
);

CREATE OR REPLACE TRIGGER trg_crm_lead_interes_bi
  BEFORE INSERT ON crm_lead_interes FOR EACH ROW
BEGIN
  IF :NEW.id_lead_interes IS NULL THEN
    :NEW.id_lead_interes := crm_lead_interes_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_HISTORIAL_ESTADO_LEAD
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_hist_lead_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_historial_estado_lead (
  id_historial_lead  NUMBER        NOT NULL,
  id_lead            NUMBER        NOT NULL,
  id_estado_anterior NUMBER,                 -- nullable: primer estado no tiene anterior
  id_estado_nuevo    NUMBER        NOT NULL,
  fecha_cambio       DATE          DEFAULT SYSDATE NOT NULL,
  id_usuario         NUMBER        NOT NULL,
  comentario         VARCHAR2(1000),
  CONSTRAINT crm_hist_lead_pk            PRIMARY KEY (id_historial_lead),
  CONSTRAINT crm_hist_lead_fk_lead       FOREIGN KEY (id_lead)            REFERENCES crm_lead (id_lead),
  CONSTRAINT crm_hist_lead_fk_est_ant    FOREIGN KEY (id_estado_anterior) REFERENCES crm_estado_lead (id_estado_lead),
  CONSTRAINT crm_hist_lead_fk_est_nuevo  FOREIGN KEY (id_estado_nuevo)    REFERENCES crm_estado_lead (id_estado_lead),
  CONSTRAINT crm_hist_lead_fk_usuario    FOREIGN KEY (id_usuario)         REFERENCES crm_usuario (id_usuario)
);

CREATE OR REPLACE TRIGGER trg_crm_hist_lead_bi
  BEFORE INSERT ON crm_historial_estado_lead FOR EACH ROW
BEGIN
  IF :NEW.id_historial_lead IS NULL THEN
    :NEW.id_historial_lead := crm_hist_lead_seq.NEXTVAL;
  END IF;
  :NEW.fecha_cambio := NVL(:NEW.fecha_cambio, SYSDATE);
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_OPORTUNIDAD
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_oportunidad_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_oportunidad (
  id_oportunidad        NUMBER        NOT NULL,
  titulo                VARCHAR2(300) NOT NULL,
  descripcion           CLOB,
  id_tipo_oportunidad   NUMBER,
  id_estado_oportunidad NUMBER        NOT NULL,
  valor_estimado        NUMBER(18,2)  DEFAULT 0,
  valor_final           NUMBER(18,2),
  probabilidad_cierre   NUMBER(3),              -- 0-100
  id_sector             NUMBER,
  fecha_cierre_estimada DATE,
  fecha_creacion        DATE          DEFAULT SYSDATE NOT NULL,
  fecha_actualizacion   DATE          DEFAULT SYSDATE NOT NULL,
  id_empresa            NUMBER,
  id_usuario            NUMBER        NOT NULL,
  id_lead_origen        NUMBER,
  id_motivo_cierre      NUMBER,
  descripcion_cierre    VARCHAR2(1000),
  CONSTRAINT crm_opp_pk              PRIMARY KEY (id_oportunidad),
  CONSTRAINT crm_opp_ck_prob         CHECK (probabilidad_cierre BETWEEN 0 AND 100),
  CONSTRAINT crm_opp_fk_tipo         FOREIGN KEY (id_tipo_oportunidad)
    REFERENCES crm_tipo_oportunidad (id_tipo_oportunidad),
  CONSTRAINT crm_opp_fk_estado       FOREIGN KEY (id_estado_oportunidad)
    REFERENCES crm_estado_oportunidad (id_estado),
  CONSTRAINT crm_opp_fk_sector       FOREIGN KEY (id_sector)
    REFERENCES crm_sector (id_sector),
  CONSTRAINT crm_opp_fk_empresa      FOREIGN KEY (id_empresa)
    REFERENCES crm_empresa (id_empresa),
  CONSTRAINT crm_opp_fk_usuario      FOREIGN KEY (id_usuario)
    REFERENCES crm_usuario (id_usuario),
  CONSTRAINT crm_opp_fk_lead         FOREIGN KEY (id_lead_origen)
    REFERENCES crm_lead (id_lead),
  CONSTRAINT crm_opp_fk_motivo       FOREIGN KEY (id_motivo_cierre)
    REFERENCES crm_motivo_cierre (id_motivo_cierre)
);

-- FK inversa lead → oportunidad (después de crear oportunidad)
ALTER TABLE crm_lead ADD CONSTRAINT crm_lead_fk_opp
  FOREIGN KEY (id_oportunidad_generada) REFERENCES crm_oportunidad (id_oportunidad);

CREATE OR REPLACE TRIGGER trg_crm_opp_bi
  BEFORE INSERT ON crm_oportunidad FOR EACH ROW
BEGIN
  IF :NEW.id_oportunidad IS NULL THEN
    :NEW.id_oportunidad := crm_oportunidad_seq.NEXTVAL;
  END IF;
  :NEW.fecha_creacion      := NVL(:NEW.fecha_creacion, SYSDATE);
  :NEW.fecha_actualizacion := SYSDATE;
END;
/

CREATE OR REPLACE TRIGGER trg_crm_opp_bu
  BEFORE UPDATE ON crm_oportunidad FOR EACH ROW
BEGIN
  :NEW.fecha_actualizacion := SYSDATE;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_OPORTUNIDAD_PRODUCTO  (N:M)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_opp_prod_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_oportunidad_producto (
  id_oportunidad_producto NUMBER NOT NULL,
  id_oportunidad          NUMBER NOT NULL,
  id_producto             NUMBER NOT NULL,
  fecha_agregado          DATE   DEFAULT SYSDATE NOT NULL,
  CONSTRAINT crm_opp_prod_pk       PRIMARY KEY (id_oportunidad_producto),
  CONSTRAINT crm_opp_prod_uk       UNIQUE (id_oportunidad, id_producto),
  CONSTRAINT crm_opp_prod_fk_opp   FOREIGN KEY (id_oportunidad) REFERENCES crm_oportunidad (id_oportunidad),
  CONSTRAINT crm_opp_prod_fk_prod  FOREIGN KEY (id_producto)    REFERENCES crm_producto (id_producto)
);

CREATE OR REPLACE TRIGGER trg_crm_opp_prod_bi
  BEFORE INSERT ON crm_oportunidad_producto FOR EACH ROW
BEGIN
  IF :NEW.id_oportunidad_producto IS NULL THEN
    :NEW.id_oportunidad_producto := crm_opp_prod_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_HISTORIAL_ESTADO  (pipeline de oportunidades)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_hist_opp_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_historial_estado (
  id_historial       NUMBER        NOT NULL,
  id_oportunidad     NUMBER        NOT NULL,
  id_estado_anterior NUMBER,
  id_estado_nuevo    NUMBER        NOT NULL,
  fecha_cambio       DATE          DEFAULT SYSDATE NOT NULL,
  id_usuario         NUMBER        NOT NULL,
  comentario         VARCHAR2(1000),
  CONSTRAINT crm_hist_opp_pk           PRIMARY KEY (id_historial),
  CONSTRAINT crm_hist_opp_fk_opp       FOREIGN KEY (id_oportunidad)     REFERENCES crm_oportunidad (id_oportunidad),
  CONSTRAINT crm_hist_opp_fk_est_ant   FOREIGN KEY (id_estado_anterior) REFERENCES crm_estado_oportunidad (id_estado),
  CONSTRAINT crm_hist_opp_fk_est_nuevo FOREIGN KEY (id_estado_nuevo)    REFERENCES crm_estado_oportunidad (id_estado),
  CONSTRAINT crm_hist_opp_fk_usuario   FOREIGN KEY (id_usuario)         REFERENCES crm_usuario (id_usuario)
);

CREATE OR REPLACE TRIGGER trg_crm_hist_opp_bi
  BEFORE INSERT ON crm_historial_estado FOR EACH ROW
BEGIN
  IF :NEW.id_historial IS NULL THEN
    :NEW.id_historial := crm_hist_opp_seq.NEXTVAL;
  END IF;
  :NEW.fecha_cambio := NVL(:NEW.fecha_cambio, SYSDATE);
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_ACTIVIDAD
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_actividad_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_actividad (
  id_actividad   NUMBER        NOT NULL,
  tipo           VARCHAR2(20)  NOT NULL,   -- VISITA | LLAMADA | REUNION | EMAIL
  asunto         VARCHAR2(300) NOT NULL,
  descripcion    CLOB,
  resultado      CLOB,
  virtual        NUMBER(1)     DEFAULT 0 NOT NULL,
  fecha_actividad DATE         NOT NULL,
  fecha_creacion  DATE         DEFAULT SYSDATE NOT NULL,
  id_lead        NUMBER,
  id_oportunidad NUMBER,
  id_usuario     NUMBER        NOT NULL,
  CONSTRAINT crm_actividad_pk          PRIMARY KEY (id_actividad),
  CONSTRAINT crm_actividad_ck_tipo     CHECK (tipo IN ('VISITA','LLAMADA','REUNION','EMAIL')),
  CONSTRAINT crm_actividad_ck_virtual  CHECK (virtual IN (0,1)),
  CONSTRAINT crm_actividad_fk_lead     FOREIGN KEY (id_lead)        REFERENCES crm_lead (id_lead),
  CONSTRAINT crm_actividad_fk_opp      FOREIGN KEY (id_oportunidad) REFERENCES crm_oportunidad (id_oportunidad),
  CONSTRAINT crm_actividad_fk_usuario  FOREIGN KEY (id_usuario)     REFERENCES crm_usuario (id_usuario)
);

CREATE OR REPLACE TRIGGER trg_crm_actividad_bi
  BEFORE INSERT ON crm_actividad FOR EACH ROW
BEGIN
  IF :NEW.id_actividad IS NULL THEN
    :NEW.id_actividad := crm_actividad_seq.NEXTVAL;
  END IF;
  :NEW.fecha_creacion := NVL(:NEW.fecha_creacion, SYSDATE);
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_UBICACION  (GPS de actividades presenciales)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_ubicacion_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_ubicacion (
  id_ubicacion  NUMBER         NOT NULL,
  latitud       NUMBER(10,7)   NOT NULL,
  longitud      NUMBER(10,7)   NOT NULL,
  precision_m   NUMBER(6),
  direccion     VARCHAR2(500),
  id_actividad  NUMBER         NOT NULL,
  CONSTRAINT crm_ubicacion_pk          PRIMARY KEY (id_ubicacion),
  CONSTRAINT crm_ubicacion_uk_actividad UNIQUE (id_actividad),
  CONSTRAINT crm_ubicacion_fk_actividad FOREIGN KEY (id_actividad) REFERENCES crm_actividad (id_actividad)
);

CREATE OR REPLACE TRIGGER trg_crm_ubicacion_bi
  BEFORE INSERT ON crm_ubicacion FOR EACH ROW
BEGIN
  IF :NEW.id_ubicacion IS NULL THEN
    :NEW.id_ubicacion := crm_ubicacion_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_PROYECTO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_proyecto_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_proyecto (
  id_proyecto           NUMBER        NOT NULL,
  nombre                VARCHAR2(300) NOT NULL,
  descripcion           CLOB,
  estado                VARCHAR2(20)  DEFAULT 'PLANIFICACION' NOT NULL,
  porcentaje_completado NUMBER(3)     DEFAULT 0 NOT NULL,
  fecha_inicio          DATE,
  fecha_fin             DATE,
  fecha_creacion        DATE          DEFAULT SYSDATE NOT NULL,
  fecha_actualizacion   DATE          DEFAULT SYSDATE NOT NULL,
  id_oportunidad        NUMBER        NOT NULL,
  id_usuario            NUMBER        NOT NULL,
  CONSTRAINT crm_proyecto_pk          PRIMARY KEY (id_proyecto),
  CONSTRAINT crm_proyecto_ck_estado   CHECK (estado IN ('PLANIFICACION','EN_EJECUCION','EN_PAUSA','ENTREGADO')),
  CONSTRAINT crm_proyecto_ck_pct      CHECK (porcentaje_completado BETWEEN 0 AND 100),
  CONSTRAINT crm_proyecto_fk_opp      FOREIGN KEY (id_oportunidad) REFERENCES crm_oportunidad (id_oportunidad),
  CONSTRAINT crm_proyecto_fk_usuario  FOREIGN KEY (id_usuario)     REFERENCES crm_usuario (id_usuario)
);

CREATE OR REPLACE TRIGGER trg_crm_proyecto_bi
  BEFORE INSERT ON crm_proyecto FOR EACH ROW
BEGIN
  IF :NEW.id_proyecto IS NULL THEN
    :NEW.id_proyecto := crm_proyecto_seq.NEXTVAL;
  END IF;
  :NEW.fecha_creacion      := NVL(:NEW.fecha_creacion, SYSDATE);
  :NEW.fecha_actualizacion := SYSDATE;
END;
/

CREATE OR REPLACE TRIGGER trg_crm_proyecto_bu
  BEFORE UPDATE ON crm_proyecto FOR EACH ROW
BEGIN
  :NEW.fecha_actualizacion := SYSDATE;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_PROYECTO_HITO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_hito_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_proyecto_hito (
  id_hito           NUMBER        NOT NULL,
  id_proyecto       NUMBER        NOT NULL,
  titulo            VARCHAR2(300) NOT NULL,
  descripcion       VARCHAR2(1000),
  estado            VARCHAR2(20)  DEFAULT 'PENDIENTE' NOT NULL,
  orden             NUMBER(3)     DEFAULT 1 NOT NULL,
  fecha_planificada DATE,
  fecha_completado  DATE,
  CONSTRAINT crm_hito_pk          PRIMARY KEY (id_hito),
  CONSTRAINT crm_hito_ck_estado   CHECK (estado IN ('COMPLETADO','EN_CURSO','PENDIENTE')),
  CONSTRAINT crm_hito_fk_proyecto FOREIGN KEY (id_proyecto) REFERENCES crm_proyecto (id_proyecto)
);

CREATE OR REPLACE TRIGGER trg_crm_hito_bi
  BEFORE INSERT ON crm_proyecto_hito FOR EACH ROW
BEGIN
  IF :NEW.id_hito IS NULL THEN
    :NEW.id_hito := crm_hito_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_META
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_meta_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_meta (
  id_meta        NUMBER        NOT NULL,
  nombre         VARCHAR2(200) NOT NULL,
  descripcion    VARCHAR2(1000),
  tipo           VARCHAR2(20)  DEFAULT 'SISTEMA' NOT NULL,
  metrica        VARCHAR2(50)  NOT NULL,
  valor_meta     NUMBER(18,2)  NOT NULL,
  unidad         VARCHAR2(20)  NOT NULL,   -- COP | CANTIDAD | PORCENTAJE
  periodo        VARCHAR2(20)  NOT NULL,   -- MENSUAL | SEMANAL | TRIMESTRAL | ANUAL
  activo         NUMBER(1)     DEFAULT 1 NOT NULL,
  id_usuario     NUMBER,                   -- NULL = aplica a todos los ejecutivos
  id_creado_por  NUMBER        NOT NULL,
  fecha_creacion DATE          DEFAULT SYSDATE NOT NULL,
  CONSTRAINT crm_meta_pk           PRIMARY KEY (id_meta),
  CONSTRAINT crm_meta_ck_metrica   CHECK (metrica IN ('VENTAS_MES','OPP_ABIERTAS','ACTIVIDADES_SEMANA','CLIENTES_NUEVOS','TASA_CONVERSION')),
  CONSTRAINT crm_meta_ck_unidad    CHECK (unidad IN ('COP','CANTIDAD','PORCENTAJE')),
  CONSTRAINT crm_meta_ck_periodo   CHECK (periodo IN ('MENSUAL','SEMANAL','TRIMESTRAL','ANUAL')),
  CONSTRAINT crm_meta_ck_activo    CHECK (activo IN (0,1)),
  CONSTRAINT crm_meta_fk_usuario   FOREIGN KEY (id_usuario)    REFERENCES crm_usuario (id_usuario),
  CONSTRAINT crm_meta_fk_creado    FOREIGN KEY (id_creado_por) REFERENCES crm_usuario (id_usuario)
);

CREATE OR REPLACE TRIGGER trg_crm_meta_bi
  BEFORE INSERT ON crm_meta FOR EACH ROW
BEGIN
  IF :NEW.id_meta IS NULL THEN
    :NEW.id_meta := crm_meta_seq.NEXTVAL;
  END IF;
  :NEW.fecha_creacion := NVL(:NEW.fecha_creacion, SYSDATE);
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_CUMPLIMIENTO_META
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_cumplimiento_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_cumplimiento_meta (
  id_cumplimiento  NUMBER       NOT NULL,
  id_meta          NUMBER       NOT NULL,
  id_usuario       NUMBER       NOT NULL,
  mes              NUMBER(2)    NOT NULL,   -- 1-12
  anio             NUMBER(4)    NOT NULL,
  valor_actual     NUMBER(18,2) DEFAULT 0 NOT NULL,
  valor_meta_snap  NUMBER(18,2) NOT NULL,   -- snapshot del valor_meta al momento del cálculo
  pct_cumplimiento NUMBER(5,2)  DEFAULT 0 NOT NULL,
  fecha_calculo    DATE         DEFAULT SYSDATE NOT NULL,
  CONSTRAINT crm_cumplimiento_pk       PRIMARY KEY (id_cumplimiento),
  CONSTRAINT crm_cumplimiento_uk       UNIQUE (id_meta, id_usuario, mes, anio),
  CONSTRAINT crm_cumplimiento_ck_mes   CHECK (mes BETWEEN 1 AND 12),
  CONSTRAINT crm_cumplimiento_fk_meta  FOREIGN KEY (id_meta)    REFERENCES crm_meta (id_meta),
  CONSTRAINT crm_cumplimiento_fk_user  FOREIGN KEY (id_usuario) REFERENCES crm_usuario (id_usuario)
);

CREATE OR REPLACE TRIGGER trg_crm_cumplimiento_bi
  BEFORE INSERT ON crm_cumplimiento_meta FOR EACH ROW
BEGIN
  IF :NEW.id_cumplimiento IS NULL THEN
    :NEW.id_cumplimiento := crm_cumplimiento_seq.NEXTVAL;
  END IF;
  :NEW.fecha_calculo := NVL(:NEW.fecha_calculo, SYSDATE);
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_NOTIFICACION
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_notificacion_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_notificacion (
  id_notificacion   NUMBER        NOT NULL,
  id_usuario_destino NUMBER       NOT NULL,
  id_usuario_origen  NUMBER,
  tipo              VARCHAR2(20)  NOT NULL,   -- CRITICA | ADVERTENCIA | INFO | EXITO
  titulo            VARCHAR2(200) NOT NULL,
  mensaje           CLOB          NOT NULL,
  canal             VARCHAR2(20)  DEFAULT 'EMAIL' NOT NULL,
  leida             NUMBER(1)     DEFAULT 0 NOT NULL,
  fecha_creacion    DATE          DEFAULT SYSDATE NOT NULL,
  fecha_lectura     DATE,
  id_lead           NUMBER,
  id_oportunidad    NUMBER,
  CONSTRAINT crm_notif_pk          PRIMARY KEY (id_notificacion),
  CONSTRAINT crm_notif_ck_tipo     CHECK (tipo IN ('CRITICA','ADVERTENCIA','INFO','EXITO')),
  CONSTRAINT crm_notif_ck_canal    CHECK (canal IN ('EMAIL','APP','SMS')),
  CONSTRAINT crm_notif_ck_leida    CHECK (leida IN (0,1)),
  CONSTRAINT crm_notif_fk_destino  FOREIGN KEY (id_usuario_destino) REFERENCES crm_usuario (id_usuario),
  CONSTRAINT crm_notif_fk_origen   FOREIGN KEY (id_usuario_origen)  REFERENCES crm_usuario (id_usuario),
  CONSTRAINT crm_notif_fk_lead     FOREIGN KEY (id_lead)            REFERENCES crm_lead (id_lead),
  CONSTRAINT crm_notif_fk_opp      FOREIGN KEY (id_oportunidad)     REFERENCES crm_oportunidad (id_oportunidad)
);

CREATE OR REPLACE TRIGGER trg_crm_notif_bi
  BEFORE INSERT ON crm_notificacion FOR EACH ROW
BEGIN
  IF :NEW.id_notificacion IS NULL THEN
    :NEW.id_notificacion := crm_notificacion_seq.NEXTVAL;
  END IF;
  :NEW.fecha_creacion := NVL(:NEW.fecha_creacion, SYSDATE);
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_AUDITORIA  (log general de cambios)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_auditoria_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_auditoria (
  id_auditoria    NUMBER        NOT NULL,
  nombre_tabla    VARCHAR2(50)  NOT NULL,
  id_registro     NUMBER        NOT NULL,
  valor_antiguo   CLOB,
  valor_nuevo     CLOB,
  tipo_operacion  VARCHAR2(10)  NOT NULL,   -- INSERT | UPDATE | DELETE
  fecha_registro  DATE          DEFAULT SYSDATE NOT NULL,
  id_usuario      NUMBER        NOT NULL,
  CONSTRAINT crm_auditoria_pk        PRIMARY KEY (id_auditoria),
  CONSTRAINT crm_auditoria_ck_op     CHECK (tipo_operacion IN ('INSERT','UPDATE','DELETE')),
  CONSTRAINT crm_auditoria_fk_user   FOREIGN KEY (id_usuario) REFERENCES crm_usuario (id_usuario)
);

CREATE OR REPLACE TRIGGER trg_crm_auditoria_bi
  BEFORE INSERT ON crm_auditoria FOR EACH ROW
BEGIN
  IF :NEW.id_auditoria IS NULL THEN
    :NEW.id_auditoria := crm_auditoria_seq.NEXTVAL;
  END IF;
  :NEW.fecha_registro := NVL(:NEW.fecha_registro, SYSDATE);
END;
/


