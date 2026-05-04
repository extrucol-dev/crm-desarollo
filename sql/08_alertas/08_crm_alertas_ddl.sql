-- ============================================================
-- CRM EXTRUCOL - ALERTAS DDL
-- Estados: PENDIENTE, LEIDA, ELIMINADA
-- ============================================================
BEGIN EXECUTE IMMEDIATE 'DROP TABLE CRM_ALERTAS CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE CRM_ALERTAS_SEQ'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

CREATE SEQUENCE CRM_ALERTAS_SEQ START WITH 100 INCREMENT BY 1 NOCACHE;

CREATE TABLE CRM_ALERTAS (
  ID            NUMBER         NOT NULL,
  TITULO        VARCHAR2(200)  NOT NULL,
  MENSAJE       CLOB,
  TIPO          VARCHAR2(20)   NOT NULL CHECK (TIPO IN ('INFO','AVISO','WARNING','ERROR')),
  USUARIO_ID    NUMBER         NOT NULL,
  ESTADO        VARCHAR2(15)   DEFAULT 'PENDIENTE' CHECK (ESTADO IN ('PENDIENTE','LEIDA','ELIMINADA')),
  FECHA_ALERTA  DATE           DEFAULT SYSDATE,
  ACTIVO        NUMBER(1)      DEFAULT 1 CHECK (ACTIVO IN (0,1)),
  CONSTRAINT CRM_ALERTAS_PK PRIMARY KEY (ID),
  CONSTRAINT CRM_ALERTAS_FK_USU FOREIGN KEY (USUARIO_ID) REFERENCES CRM_USUARIOS(ID)
);

CREATE INDEX CRM_ALERTAS_USU_IDX   ON CRM_ALERTAS(USUARIO_ID);
CREATE INDEX CRM_ALERTAS_ESTADO_IDX ON CRM_ALERTAS(ESTADO);
CREATE INDEX CRM_ALERTAS_FECHA_IDX ON CRM_ALERTAS(FECHA_ALERTA);

CREATE OR REPLACE TRIGGER TRG_ALERTAS_BI
BEFORE INSERT ON CRM_ALERTAS FOR EACH ROW
BEGIN
  IF :NEW.ID IS NULL THEN :NEW.ID := CRM_ALERTAS_SEQ.NEXTVAL; END IF;
END TRG_ALERTAS_BI;
/

-- ============================================================
-- CRM EXTRUCOL - ALERTAS SEED DATA
-- ============================================================
INSERT INTO CRM_ALERTAS (ID, TITULO, MENSAJE, TIPO, USUARIO_ID, ESTADO, FECHA_ALERTA) VALUES
(1, 'Oportunidad estancada',   'Licitación acueducto Bucaramanga lleva +15 días sin actividad. Avanza o cierra.',    'WARNING', 3, 'LEIDA',     '2026-04-20'),
(2, 'Meta de abril en riesgo', 'Llevas 3 de 5 oportunidades cerradas. Alcanza tu meta antes del 30.',           'WARNING', 3, 'PENDIENTE', '2026-04-28'),
(3, 'Actividad completada',    'Registro de visita técnica completado exitosamente.',                                'INFO',    3, 'LEIDA',     '2026-04-14'),
(4, 'Oportunidad ganada',      'Felicidades! Contrato anual tuberías Bucaramanga cerrado por $850M.',              'INFO',    3, 'PENDIENTE', '2026-04-15'),
(5, 'Lead sin seguimiento',    'Carlos Mendoza (Constructora Mendoza) tiene leads sin contacto en 7 días.',         'WARNING', 4, 'PENDIENTE', '2026-04-28');
COMMIT;