-- =============================================================================
-- CRM EXTRUCOL — Setup inicial para demo
-- ============================================================================
-- Ejecutar en APEX SQL Workshop (o SQL Developer conectado al schema)
-- después de haber corrido: 03_ddl_drop, 04_ddl_catalogs, 05_ddl_core,
-- 07_seed_reference, 08_ddl_indexes, 09_seed_demo
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 1: Verificar workspace username
-- ─────────────────────────────────────────────────────────────────────────────
-- Ejecuta esta consulta para conocer tu username exacto en el workspace.
-- El resultado告诉你 qué valor usar en PASO 2.

SELECT 'Tu username de APEX Workspace es: [' || v('APP_USER') || ']'
  AS paso_1_consulta_obligatoria
  FROM DUAL;

-- Si APP_USER es NULL, puede ser que estés usando autenticación a nivel de página.
-- Ejecuta también esta para encontrar todos los posibles usernames:
SELECT username, account_status, created_on
  FROM all_users
 WHERE username LIKE '%CRM%'
    OR username LIKE '%EXTRU%'
    OR username LIKE '%CAPACI%'
 ORDER BY created_on DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 2: Insertar el usuario que coincide con tu APEX Workspace
-- ─────────────────────────────────────────────────────────────────────────────
--
-- Reemplaza 'AQUI_TU_USERNAME' con el valor que viste en el PASO 1.
-- Si el resultado fue NULL, usa un valor que conozcas del workspace.
--
-- Roles válidos: DIRECTOR | COORDINADOR | EJECUTIVO | ADMINISTRADOR

INSERT INTO crm_usuario (id_usuario, nombre, email, apex_username, password, rol, activo, id_departamento)
VALUES (99, 'Mi Usuario Workspace', 'workspace@extrucol.com', 'AQUI_TU_USERNAME', 'APEX_MANAGED', 'DIRECTOR', 1, 103);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 3: Verificar que el usuario se creó correctamente
-- ─────────────────────────────────────────────────────────────────────────────

SELECT u.nombre, u.rol, u.apex_username, u.activo
  FROM crm_usuario u
 WHERE UPPER(u.apex_username) = UPPER(v('APP_USER'))
    OR u.id_usuario = 99;


-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 4: Verificar datos de demo cargados
-- ─────────────────────────────────────────────────────────────────────────────

SELECT 'RESUMEN DE DATOS CARGADOS:' AS info FROM DUAL
UNION ALL SELECT 'Usuarios.......: ' || COUNT(*) FROM crm_usuario
UNION ALL SELECT 'Empresas.......: ' || COUNT(*) FROM crm_empresa
UNION ALL SELECT 'Leads..........: ' || COUNT(*) FROM crm_lead
UNION ALL SELECT 'Oportunidades..: ' || COUNT(*) FROM crm_oportunidad
UNION ALL SELECT 'Actividades....: ' || COUNT(*) FROM crm_actividad
UNION ALL SELECT 'Proyectos......: ' || COUNT(*) FROM crm_proyecto
UNION ALL SELECT 'Sectores.......: ' || COUNT(*) FROM crm_sector
UNION ALL SELECT 'Departamentos..: ' || COUNT(*) FROM crm_departamento;

-- Validar que los FK de estado_lead references existen
SELECT 'Estados de Lead:' AS c, COUNT(*) AS total FROM crm_estado_lead
UNION ALL SELECT 'Origenes de Lead:', COUNT(*) FROM crm_origen_lead
UNION ALL SELECT 'Estados Opp:', COUNT(*) FROM crm_estado_oportunidad
UNION ALL SELECT 'Tipos Oportunidad:', COUNT(*) FROM crm_tipo_oportunidad
UNION ALL SELECT 'Sectores:', COUNT(*) FROM crm_sector
UNION ALL SELECT 'Intereses:', COUNT(*) FROM crm_interes
UNION ALL SELECT 'Motivos cierre:', COUNT(*) FROM crm_motivo_cierre
UNION ALL SELECT 'Metas:', COUNT(*) FROM crm_meta;

PROMPT
PROMPT Listo para probar. Ahora en APEX Builder:
PROMPT 1. Registra los 54 procesos APEX usando el CSV en apex/sql/procesos_apex.csv
PROMPT 2. Sube los archivos de dist/ a Static Application Files
PROMPT 3. Abre http://192.168.103.3/apex/capacitacion/r/seguiemiento-demo-react/maito