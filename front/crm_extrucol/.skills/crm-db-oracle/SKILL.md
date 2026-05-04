---
name: crm-db-oracle
description: >-
  CRM Extrucol Oracle DB y configuración APEX. SIEMPRE USA cuando: crear tabla Oracle, escribir
  package PL/SQL, crear vista analítica, agregar secuencia trigger, configurar esquema CRM, script
  SQL, crear procedimiento, diseñar entidad nueva, consultar modelo de datos CRM_ER, agregar campo
  a tabla, crear índice, configurar aplicación APEX, subir archivos estáticos React a APEX.
  Trigger on: "tabla", "package", "procedimiento", "vista", "secuencia", "trigger", "schema",
  "sql script", "entidad", "CRM_ER", "Oracle", "PL/SQL", "APEX app", "Static Files", "configurar APEX".
---

# CRM Extrucol — Oracle DB & Configuración APEX

Modelo de datos canónico: `CRM_ER_v4.md` (raíz del proyecto mockups).
Scripts SQL: `apex/seguimiento/sql/` en el repo de mockups.

---

## Entidades principales

| Tabla | PK | Descripción |
|-------|-----|-------------|
| `CRM_USUARIOS` | `ID` | Ejecutivos, coordinadores, directores, admin |
| `CRM_CIUDADES` | `ID` | Catálogo geográfico |
| `CRM_CLIENTES` | `ID` | Empresas/personas contactadas |
| `CRM_LEADS` | `ID` | Prospectos en calificación |
| `CRM_OPORTUNIDADES` | `ID` | Negocios en pipeline |
| `CRM_ACTIVIDADES` | `ID` | Visitas, llamadas, demos |
| `CRM_PROYECTOS` | `ID` | Proyectos post-cierre |
| `CRM_METAS` | `ID` | Metas mensuales por ejecutivo |
| `CRM_ALERTAS` | `ID` | Alertas de reglas de negocio |

---

## Convenciones de nombrado

```sql
-- Tablas:      CRM_{ENTIDAD}             (singular, MAYÚSCULAS)
-- Secuencias:  CRM_{ENTIDAD}_SEQ
-- Índices:     CRM_{ENTIDAD}_{CAMPO}_IDX
-- Paquetes:    CRM_{FEATURE}_API         (ej. CRM_LEADS_API)
-- Vistas:      V_{ENTIDAD}               (ej. V_OPORTUNIDADES_ACTIVAS)
-- Triggers:    TRG_{ENTIDAD}_{EVENTO}    (ej. TRG_LEADS_BI, TRG_LEADS_BU)
-- Constraints: CRM_{TABLA}_{PK|FK|UK}_{CAMPO}
```

---

## Template: Tabla con secuencia y triggers

```sql
-- ── DROP idempotente ──────────────────────────────────────────────────────────
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE CRM_{ENTIDAD}_SEQ'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE CRM_{ENTIDAD} CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- ── Secuencia — START WITH 100 reserva IDs 1-99 para seed ────────────────────
CREATE SEQUENCE CRM_{ENTIDAD}_SEQ START WITH 100 INCREMENT BY 1 NOCACHE;

-- ── Tabla ─────────────────────────────────────────────────────────────────────
CREATE TABLE CRM_{ENTIDAD} (
  ID              NUMBER         NOT NULL,
  NOMBRE          VARCHAR2(200)  NOT NULL,
  DESCRIPCION     CLOB,
  ESTADO          VARCHAR2(30)   DEFAULT 'ACTIVO'
                  CHECK (ESTADO IN ('ACTIVO','INACTIVO')),
  EJECUTIVO_ID    NUMBER         NOT NULL,
  CIUDAD_ID       NUMBER,
  ACTIVO          NUMBER(1)      DEFAULT 1 CHECK (ACTIVO IN (0,1)),
  FECHA_CREACION  DATE           DEFAULT SYSDATE,
  FECHA_UPDATE    DATE           DEFAULT SYSDATE,
  CONSTRAINT CRM_{ENTIDAD}_PK PRIMARY KEY (ID)
);

-- ── FKs separadas (fácil de drop/re-add en desarrollo) ───────────────────────
ALTER TABLE CRM_{ENTIDAD} ADD CONSTRAINT CRM_{ENTIDAD}_FK_EJEC
  FOREIGN KEY (EJECUTIVO_ID) REFERENCES CRM_USUARIOS(ID);
ALTER TABLE CRM_{ENTIDAD} ADD CONSTRAINT CRM_{ENTIDAD}_FK_CIUDAD
  FOREIGN KEY (CIUDAD_ID) REFERENCES CRM_CIUDADES(ID);

-- ── Índices en FKs ────────────────────────────────────────────────────────────
CREATE INDEX CRM_{ENTIDAD}_EJEC_IDX   ON CRM_{ENTIDAD}(EJECUTIVO_ID);
CREATE INDEX CRM_{ENTIDAD}_ESTADO_IDX ON CRM_{ENTIDAD}(ESTADO);

-- ── Trigger PK automático ─────────────────────────────────────────────────────
CREATE OR REPLACE TRIGGER TRG_{ENTIDAD}_BI
BEFORE INSERT ON CRM_{ENTIDAD} FOR EACH ROW
BEGIN
  IF :NEW.ID IS NULL THEN
    :NEW.ID := CRM_{ENTIDAD}_SEQ.NEXTVAL;
  END IF;
END TRG_{ENTIDAD}_BI;
/

-- ── Trigger FECHA_UPDATE ──────────────────────────────────────────────────────
CREATE OR REPLACE TRIGGER TRG_{ENTIDAD}_BU
BEFORE UPDATE ON CRM_{ENTIDAD} FOR EACH ROW
BEGIN
  :NEW.FECHA_UPDATE := SYSDATE;
END TRG_{ENTIDAD}_BU;
/
```

---

## Template: Package PL/SQL (CRM_{FEATURE}_API)

Todos los procedimientos usan `p_result OUT SYS_REFCURSOR` — incluso mutaciones devuelven un cursor con `{id, success}` para que el frontend use `unwrap()`.

```sql
-- ── SPEC ──────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE CRM_{FEATURE}_API AS

  -- Lista (filtro opcional)
  PROCEDURE {FEATURE}_LIST(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  VARCHAR2 DEFAULT NULL   -- filtro ej. ejecutivo_id
  );

  -- Detalle por ID
  PROCEDURE {FEATURE}_GET(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  NUMBER                  -- id (requerido)
  );

  -- Creación
  PROCEDURE {FEATURE}_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  VARCHAR2,               -- campo requerido
    p_x02    IN  VARCHAR2 DEFAULT NULL,
    p_x03    IN  NUMBER   DEFAULT NULL
  );

  -- Actualización
  PROCEDURE {FEATURE}_UPDATE(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  NUMBER,                 -- id (requerido)
    p_x02    IN  VARCHAR2 DEFAULT NULL,
    p_x03    IN  VARCHAR2 DEFAULT NULL
  );

END CRM_{FEATURE}_API;
/

-- ── BODY ──────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE BODY CRM_{FEATURE}_API AS

  PROCEDURE {FEATURE}_LIST(p_result OUT SYS_REFCURSOR, p_x01 IN VARCHAR2 DEFAULT NULL) IS
  BEGIN
    OPEN p_result FOR
      SELECT t.id, t.nombre, t.estado, t.fecha_creacion
        FROM CRM_{ENTIDAD} t
       WHERE t.activo = 1
         AND (p_x01 IS NULL OR t.ejecutivo_id = TO_NUMBER(p_x01))
       ORDER BY t.fecha_creacion DESC;
  END;

  PROCEDURE {FEATURE}_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2, p_x02 IN VARCHAR2 DEFAULT NULL, p_x03 IN NUMBER DEFAULT NULL
  ) IS
    v_id NUMBER;
  BEGIN
    INSERT INTO CRM_{ENTIDAD} (nombre, descripcion, ejecutivo_id)
    VALUES (p_x01, p_x02, NVL(p_x03, SYS_CONTEXT('APEX$SESSION','APP_USER_ID')))
    RETURNING id INTO v_id;
    COMMIT;
    OPEN p_result FOR SELECT v_id AS id, 'true' AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OPEN p_result FOR
        SELECT 0 AS id, 'false' AS success,
               DBMS_UTILITY.FORMAT_ERROR_STACK AS error FROM DUAL;
  END;

END CRM_{FEATURE}_API;
/
```

**Scripts de referencia del proyecto:**
- `sql/02_crm_leads_api_spec.sql` — spec completo de CRM_LEADS_API
- `sql/03_crm_leads_api_body.sql` — body completo con todos los procedimientos

---

## Vistas analíticas útiles

```sql
-- Oportunidades activas con contexto completo
CREATE OR REPLACE VIEW V_OPORTUNIDADES AS
SELECT o.id, o.nombre, o.estado, o.valor_estimado, o.fecha_cierre,
       c.nombre  AS cliente,
       u.nombre  AS ejecutivo,
       (SELECT COUNT(*) FROM crm_actividades a WHERE a.oportunidad_id = o.id AND a.activo = 1) AS total_actividades,
       (SELECT MAX(a.fecha_actividad) FROM crm_actividades a WHERE a.oportunidad_id = o.id)    AS ultima_actividad
  FROM crm_oportunidades o
  JOIN crm_clientes  c ON c.id = o.cliente_id
  JOIN crm_usuarios  u ON u.id = o.ejecutivo_id
 WHERE o.activo = 1;

-- Leads por estado (para kanban)
CREATE OR REPLACE VIEW V_LEADS_KANBAN AS
SELECT l.id, l.nombre, l.empresa, l.email, l.estado, l.fecha_creacion,
       c.nombre AS ciudad, u.nombre AS ejecutivo
  FROM crm_leads     l
  LEFT JOIN crm_ciudades c ON c.id = l.ciudad_id
  LEFT JOIN crm_usuarios u ON u.id = l.ejecutivo_id
 WHERE l.activo = 1
 ORDER BY l.fecha_creacion DESC;
```

---

## Consultas de diagnóstico

```sql
-- Errores de compilación en paquetes
SELECT name, type, line, text FROM user_errors
 WHERE name LIKE 'CRM_%' ORDER BY name, sequence;

-- Estado de todos los objetos del CRM
SELECT object_name, object_type, status FROM user_objects
 WHERE object_name LIKE 'CRM_%' ORDER BY object_type, object_name;

-- Oportunidades estancadas (sin actividad en N días)
SELECT o.id, o.nombre, TRUNC(SYSDATE - MAX(a.fecha_actividad)) AS dias_inactivo
  FROM crm_oportunidades o
  LEFT JOIN crm_actividades a ON a.oportunidad_id = o.id
 WHERE o.estado NOT IN ('GANADA','PERDIDA') AND o.activo = 1
 GROUP BY o.id, o.nombre
HAVING TRUNC(SYSDATE - MAX(a.fecha_actividad)) > 7
 ORDER BY dias_inactivo DESC;

-- Usuario APEX actual y su rol CRM
SELECT u.id, u.nombre, u.rol
  FROM crm_usuarios u
 WHERE UPPER(u.email) = UPPER(v('APP_USER'));
```

---

## Estados de las entidades

| Entidad | Estados válidos |
|---------|----------------|
| `CRM_LEADS.estado` | `NUEVO`, `CONTACTADO`, `CALIFICADO`, `DESCARTADO`, `CONVERTIDO` |
| `CRM_OPORTUNIDADES.estado` | `PROSPECTO`, `CALIFICACION`, `PROPUESTA`, `NEGOCIACION`, `GANADA`, `PERDIDA` |
| `CRM_ACTIVIDADES.estado` | `PENDIENTE`, `REALIZADA`, `CANCELADA` |
| `CRM_PROYECTOS.estado` | `EN_CURSO`, `COMPLETADO`, `PAUSADO`, `CANCELADO` |
| `CRM_ALERTAS.tipo` | `INACTIVIDAD`, `META_RIESGO`, `OPORTUNIDAD_VENCIDA`, `LEAD_ESTANCADO` |

---

## Configuración APEX — pasos esenciales

### 1. Crear la aplicación
```
App Builder → Create → New Application
  Name: CRM Extrucol
  Theme: Universal Theme (UI la maneja React — dejar vacío)
```

### 2. Configurar autenticación
```
Shared Components → Authentication Schemes → APEX Accounts
(o LDAP/SSO según el entorno)
```

### 3. Crear página host para React
```
Create Page → Blank Page → Page ID: 1
En "HTML Header" agregar:
  <link rel="stylesheet" href="#APP_FILES#assets/index.css">
En "Execute when Page Loads" agregar:
  <div id="root"></div>
  <script type="module" src="#APP_FILES#assets/index.js"></script>
```

### 4. Subir archivos estáticos (build React)
```
Shared Components → Static Application Files
  Upload: dist/assets/index.js   ← npm run build:apex (sin hash en nombres)
  Upload: dist/assets/index.css
```
Los nombres sin hash están garantizados por `vite.config.js`:
```js
rollupOptions.output.entryFileNames = 'assets/[name].js'  // sin [hash]
```

### 5. Crear Application Processes
Ver skill `/crm-apex-processes` para los 49 procesos del catálogo.

---

## Scripts SQL del proyecto

| Archivo | Contenido |
|---------|-----------|
| `sql/00_crm_catalogos_base.sql` | Ciudades y catálogos base |
| `sql/00_crm_leads_ddl.sql` | DDL tabla CRM_LEADS |
| `sql/01_crm_leads_seed.sql` | Datos de prueba |
| `sql/02_crm_leads_api_spec.sql` | Spec paquetes CRM_LEADS_API |
| `sql/03_crm_leads_api_body.sql` | Body paquetes CRM_LEADS_API |
| `sql/04_crm_leads_apex_procesos.sql` | Application Processes |
| `sql/05_crm_leads_test_suite.sql` | Suite de pruebas PL/SQL |

Ruta: `crm-mockups-open/apex/seguimiento/sql/`
