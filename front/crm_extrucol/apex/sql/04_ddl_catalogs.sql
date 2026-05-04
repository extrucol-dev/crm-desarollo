-- =============================================================================
-- CRM EXTRUCOL — DDL TABLAS CATÁLOGO / REFERENCIA
-- Tablas sin dependencias (o solo entre sí): geografía, dominios, config.
-- Ejecutar ANTES de 05_ddl_core.sql
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_PAIS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_pais_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_pais (
  id_pais   NUMBER        NOT NULL,
  nombre    VARCHAR2(100) NOT NULL,
  codigo    VARCHAR2(3)   NOT NULL,
  CONSTRAINT crm_pais_pk  PRIMARY KEY (id_pais),
  CONSTRAINT crm_pais_uk_codigo UNIQUE (codigo)
);

CREATE OR REPLACE TRIGGER trg_crm_pais_bi
  BEFORE INSERT ON crm_pais FOR EACH ROW
BEGIN
  IF :NEW.id_pais IS NULL THEN
    :NEW.id_pais := crm_pais_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_DEPARTAMENTO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_departamento_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_departamento (
  id_departamento NUMBER        NOT NULL,
  nombre          VARCHAR2(100) NOT NULL,
  codigo          VARCHAR2(5),
  id_pais         NUMBER        NOT NULL,
  CONSTRAINT crm_departamento_pk    PRIMARY KEY (id_departamento),
  CONSTRAINT crm_departamento_fk_pais FOREIGN KEY (id_pais) REFERENCES crm_pais (id_pais)
);

CREATE OR REPLACE TRIGGER trg_crm_departamento_bi
  BEFORE INSERT ON crm_departamento FOR EACH ROW
BEGIN
  IF :NEW.id_departamento IS NULL THEN
    :NEW.id_departamento := crm_departamento_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_MUNICIPIO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_municipio_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_municipio (
  id_municipio    NUMBER        NOT NULL,
  nombre          VARCHAR2(100) NOT NULL,
  codigo          VARCHAR2(10),
  id_departamento NUMBER        NOT NULL,
  CONSTRAINT crm_municipio_pk       PRIMARY KEY (id_municipio),
  CONSTRAINT crm_municipio_fk_depto FOREIGN KEY (id_departamento)
    REFERENCES crm_departamento (id_departamento)
);

CREATE OR REPLACE TRIGGER trg_crm_municipio_bi
  BEFORE INSERT ON crm_municipio FOR EACH ROW
BEGIN
  IF :NEW.id_municipio IS NULL THEN
    :NEW.id_municipio := crm_municipio_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_DOCUMENTO  (tipos de documento: NIT, Cédula, etc.)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_documento_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_documento (
  id_documento NUMBER       NOT NULL,
  tipo         VARCHAR2(30) NOT NULL,
  codigo       VARCHAR2(10) NOT NULL,
  CONSTRAINT crm_documento_pk      PRIMARY KEY (id_documento),
  CONSTRAINT crm_documento_uk_tipo UNIQUE (tipo)
);

CREATE OR REPLACE TRIGGER trg_crm_documento_bi
  BEFORE INSERT ON crm_documento FOR EACH ROW
BEGIN
  IF :NEW.id_documento IS NULL THEN
    :NEW.id_documento := crm_documento_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_SECTOR
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_sector_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_sector (
  id_sector   NUMBER        NOT NULL,
  nombre      VARCHAR2(100) NOT NULL,
  descripcion VARCHAR2(500),
  color_hex   VARCHAR2(9),
  CONSTRAINT crm_sector_pk    PRIMARY KEY (id_sector),
  CONSTRAINT crm_sector_uk_nombre UNIQUE (nombre)
);

CREATE OR REPLACE TRIGGER trg_crm_sector_bi
  BEFORE INSERT ON crm_sector FOR EACH ROW
BEGIN
  IF :NEW.id_sector IS NULL THEN
    :NEW.id_sector := crm_sector_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_MODALIDAD  (Interior / Exterior)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_modalidad_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_modalidad (
  id_modalidad NUMBER        NOT NULL,
  nombre       VARCHAR2(50)  NOT NULL,
  CONSTRAINT crm_modalidad_pk      PRIMARY KEY (id_modalidad),
  CONSTRAINT crm_modalidad_uk_nombre UNIQUE (nombre)
);

CREATE OR REPLACE TRIGGER trg_crm_modalidad_bi
  BEFORE INSERT ON crm_modalidad FOR EACH ROW
BEGIN
  IF :NEW.id_modalidad IS NULL THEN
    :NEW.id_modalidad := crm_modalidad_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_ORIGEN_LEAD  (WhatsApp, Instagram, Referido, etc.)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_origen_lead_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_origen_lead (
  id_origen_lead NUMBER        NOT NULL,
  nombre         VARCHAR2(100) NOT NULL,
  color_hex      VARCHAR2(9),
  descripcion    VARCHAR2(500),
  activo         NUMBER(1)     DEFAULT 1 NOT NULL,
  CONSTRAINT crm_origen_lead_pk       PRIMARY KEY (id_origen_lead),
  CONSTRAINT crm_origen_lead_uk_nombre UNIQUE (nombre),
  CONSTRAINT crm_origen_lead_ck_activo CHECK (activo IN (0,1))
);

CREATE OR REPLACE TRIGGER trg_crm_origen_lead_bi
  BEFORE INSERT ON crm_origen_lead FOR EACH ROW
BEGIN
  IF :NEW.id_origen_lead IS NULL THEN
    :NEW.id_origen_lead := crm_origen_lead_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_ESTADO_LEAD
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_estado_lead_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_estado_lead (
  id_estado_lead NUMBER       NOT NULL,
  nombre         VARCHAR2(50) NOT NULL,
  tipo           VARCHAR2(20) NOT NULL,   -- ABIERTO | CALIFICADO | DESCALIFICADO
  orden          NUMBER(3)    NOT NULL,
  color_hex      VARCHAR2(9),
  CONSTRAINT crm_estado_lead_pk       PRIMARY KEY (id_estado_lead),
  CONSTRAINT crm_estado_lead_uk_nombre UNIQUE (nombre),
  CONSTRAINT crm_estado_lead_ck_tipo  CHECK (tipo IN ('ABIERTO','CALIFICADO','DESCALIFICADO'))
);

CREATE OR REPLACE TRIGGER trg_crm_estado_lead_bi
  BEFORE INSERT ON crm_estado_lead FOR EACH ROW
BEGIN
  IF :NEW.id_estado_lead IS NULL THEN
    :NEW.id_estado_lead := crm_estado_lead_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_INTERES  (Tubería PE100, Accesorios, Riego, Válvulas, etc.)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_interes_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_interes (
  id_interes  NUMBER        NOT NULL,
  nombre      VARCHAR2(100) NOT NULL,
  descripcion VARCHAR2(500),
  activo      NUMBER(1)     DEFAULT 1 NOT NULL,
  CONSTRAINT crm_interes_pk       PRIMARY KEY (id_interes),
  CONSTRAINT crm_interes_uk_nombre UNIQUE (nombre),
  CONSTRAINT crm_interes_ck_activo CHECK (activo IN (0,1))
);

CREATE OR REPLACE TRIGGER trg_crm_interes_bi
  BEFORE INSERT ON crm_interes FOR EACH ROW
BEGIN
  IF :NEW.id_interes IS NULL THEN
    :NEW.id_interes := crm_interes_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_MOTIVO_DESCALIFICACION
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_motivo_desc_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_motivo_descalificacion (
  id_motivo_descalificacion NUMBER        NOT NULL,
  nombre                    VARCHAR2(100) NOT NULL,
  descripcion               VARCHAR2(500),
  activo                    NUMBER(1)     DEFAULT 1 NOT NULL,
  CONSTRAINT crm_motivo_desc_pk       PRIMARY KEY (id_motivo_descalificacion),
  CONSTRAINT crm_motivo_desc_uk_nombre UNIQUE (nombre),
  CONSTRAINT crm_motivo_desc_ck_activo CHECK (activo IN (0,1))
);

CREATE OR REPLACE TRIGGER trg_crm_motivo_desc_bi
  BEFORE INSERT ON crm_motivo_descalificacion FOR EACH ROW
BEGIN
  IF :NEW.id_motivo_descalificacion IS NULL THEN
    :NEW.id_motivo_descalificacion := crm_motivo_desc_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_PRODUCTO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_producto_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_producto (
  id_producto NUMBER        NOT NULL,
  nombre      VARCHAR2(200) NOT NULL,
  descripcion CLOB,
  tipo        VARCHAR2(50),
  activo      NUMBER(1)     DEFAULT 1 NOT NULL,
  CONSTRAINT crm_producto_pk       PRIMARY KEY (id_producto),
  CONSTRAINT crm_producto_ck_activo CHECK (activo IN (0,1))
);

CREATE OR REPLACE TRIGGER trg_crm_producto_bi
  BEFORE INSERT ON crm_producto FOR EACH ROW
BEGIN
  IF :NEW.id_producto IS NULL THEN
    :NEW.id_producto := crm_producto_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_TIPO_OPORTUNIDAD  (Licitación pública, Suministro directo, etc.)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_tipo_opp_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_tipo_oportunidad (
  id_tipo_oportunidad NUMBER        NOT NULL,
  nombre              VARCHAR2(100) NOT NULL,
  descripcion         VARCHAR2(500),
  CONSTRAINT crm_tipo_opp_pk       PRIMARY KEY (id_tipo_oportunidad),
  CONSTRAINT crm_tipo_opp_uk_nombre UNIQUE (nombre)
);

CREATE OR REPLACE TRIGGER trg_crm_tipo_opp_bi
  BEFORE INSERT ON crm_tipo_oportunidad FOR EACH ROW
BEGIN
  IF :NEW.id_tipo_oportunidad IS NULL THEN
    :NEW.id_tipo_oportunidad := crm_tipo_opp_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_ESTADO_OPORTUNIDAD  (Prospección → Ganada / Perdida)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_estado_opp_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_estado_oportunidad (
  id_estado NUMBER       NOT NULL,
  nombre    VARCHAR2(50) NOT NULL,
  tipo      VARCHAR2(10) NOT NULL,   -- ABIERTO | GANADO | PERDIDO
  orden     NUMBER(3)    NOT NULL,
  color_hex VARCHAR2(9),
  CONSTRAINT crm_estado_opp_pk       PRIMARY KEY (id_estado),
  CONSTRAINT crm_estado_opp_uk_nombre UNIQUE (nombre),
  CONSTRAINT crm_estado_opp_ck_tipo  CHECK (tipo IN ('ABIERTO','GANADO','PERDIDO'))
);

CREATE OR REPLACE TRIGGER trg_crm_estado_opp_bi
  BEFORE INSERT ON crm_estado_oportunidad FOR EACH ROW
BEGIN
  IF :NEW.id_estado IS NULL THEN
    :NEW.id_estado := crm_estado_opp_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_MOTIVO_CIERRE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_motivo_cierre_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_motivo_cierre (
  id_motivo_cierre NUMBER        NOT NULL,
  nombre           VARCHAR2(100) NOT NULL,
  tipo             VARCHAR2(10)  NOT NULL,   -- GANADO | PERDIDO
  descripcion      VARCHAR2(500),
  CONSTRAINT crm_motivo_cierre_pk       PRIMARY KEY (id_motivo_cierre),
  CONSTRAINT crm_motivo_cierre_uk_nombre UNIQUE (nombre),
  CONSTRAINT crm_motivo_cierre_ck_tipo  CHECK (tipo IN ('GANADO','PERDIDO'))
);

CREATE OR REPLACE TRIGGER trg_crm_motivo_cierre_bi
  BEFORE INSERT ON crm_motivo_cierre FOR EACH ROW
BEGIN
  IF :NEW.id_motivo_cierre IS NULL THEN
    :NEW.id_motivo_cierre := crm_motivo_cierre_seq.NEXTVAL;
  END IF;
END;
/


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_CONFIGURACION_SISTEMA  (parámetros globales del negocio)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE crm_config_seq START WITH 100 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE crm_configuracion_sistema (
  id_configuracion   NUMBER        NOT NULL,
  clave              VARCHAR2(100) NOT NULL,
  valor              VARCHAR2(500) NOT NULL,
  unidad             VARCHAR2(30),
  descripcion        VARCHAR2(500),
  fecha_actualizacion DATE          DEFAULT SYSDATE NOT NULL,
  CONSTRAINT crm_config_pk       PRIMARY KEY (id_configuracion),
  CONSTRAINT crm_config_uk_clave UNIQUE (clave)
);

CREATE OR REPLACE TRIGGER trg_crm_config_bi
  BEFORE INSERT ON crm_configuracion_sistema FOR EACH ROW
BEGIN
  IF :NEW.id_configuracion IS NULL THEN
    :NEW.id_configuracion := crm_config_seq.NEXTVAL;
  END IF;
  :NEW.fecha_actualizacion := SYSDATE;
END;
/

CREATE OR REPLACE TRIGGER trg_crm_config_bu
  BEFORE UPDATE ON crm_configuracion_sistema FOR EACH ROW
BEGIN
  :NEW.fecha_actualizacion := SYSDATE;
END;
/


