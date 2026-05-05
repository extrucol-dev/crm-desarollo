-- =============================================================================
-- CRM EXTRUCOL — PACKAGES PL/SQL
-- Depende de: 05_ddl_core.sql
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- CRM_SESSION_API
--
-- Por qué existe este paquete:
--   v('APP_USER') devuelve el username de APEX Workspace (ej: RENE.VILLAZON),
--   que NO necesariamente es el email del usuario en CRM_USUARIO.
--   Centralizar el lookup aquí evita duplicar la lógica en los 30+ procesos
--   y permite cambiar la estrategia de resolución en un solo lugar.
--
-- Lógica de resolución (en orden):
--   1. apex_username exacto  (match más confiable)
--   2. email case-insensitive (fallback para modo REST / usuarios legacy)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE PACKAGE crm_session_api AS

  -- Devuelve id_usuario del usuario APEX activo.
  -- Lanza NO_DATA_FOUND si el username no existe en CRM_USUARIO.
  FUNCTION get_usuario_id RETURN NUMBER;

  -- Devuelve el rol del usuario APEX activo (EJECUTIVO, COORDINADOR, etc.).
  FUNCTION get_rol RETURN VARCHAR2;

  -- Devuelve TRUE si el usuario activo tiene alguno de los roles indicados.
  -- Uso: IF crm_session_api.tiene_rol('DIRECTOR,COORDINADOR') THEN ...
  FUNCTION tiene_rol(p_roles VARCHAR2) RETURN BOOLEAN;

  -- Registra ultimo_acceso = SYSDATE para el usuario activo.
  PROCEDURE registrar_acceso;

END crm_session_api;
/

CREATE OR REPLACE PACKAGE BODY crm_session_api AS

  -- Cache de sesión para no repetir el SELECT en cada llamada del mismo request
  g_usuario_id NUMBER  := NULL;
  g_rol        VARCHAR2(20) := NULL;

  PROCEDURE cargar_sesion IS
  BEGIN
    IF g_usuario_id IS NOT NULL THEN RETURN; END IF;

    SELECT id_usuario, rol
      INTO g_usuario_id, g_rol
      FROM crm_usuario
     WHERE activo = 1
       AND (
         -- 1. Match por apex_username (prioritario)
         UPPER(apex_username) = UPPER(v('APP_USER'))
         OR
         -- 2. Fallback: match por email (para usuarios pre-APEX / REST)
         (apex_username IS NULL AND UPPER(email) = UPPER(v('APP_USER')))
       )
       AND ROWNUM = 1;

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      -- Usuario APEX no registrado en CRM_USUARIO
      RAISE_APPLICATION_ERROR(-20001,
        'Usuario APEX "' || v('APP_USER') || '" no encontrado en CRM_USUARIO. ' ||
        'Verifique que apex_username esté configurado.');
  END;

  FUNCTION get_usuario_id RETURN NUMBER IS
  BEGIN
    cargar_sesion;
    RETURN g_usuario_id;
  END;

  FUNCTION get_rol RETURN VARCHAR2 IS
  BEGIN
    cargar_sesion;
    RETURN g_rol;
  END;

  FUNCTION tiene_rol(p_roles VARCHAR2) RETURN BOOLEAN IS
    l_rol VARCHAR2(20) := get_rol;
  BEGIN
    -- p_roles puede ser 'DIRECTOR' o 'DIRECTOR,COORDINADOR'
    RETURN INSTR(',' || UPPER(p_roles) || ',', ',' || UPPER(l_rol) || ',') > 0;
  END;

  PROCEDURE registrar_acceso IS
  BEGIN
    UPDATE crm_usuario
       SET ultimo_acceso = SYSDATE
     WHERE id_usuario = get_usuario_id;
  END;

END crm_session_api;
/

PROMPT ✓ Package CRM_SESSION_API creado.


-- ─────────────────────────────────────────────────────────────────────────────
-- Si la tabla ya existe (deploy sobre esquema existente):
-- ALTER TABLE crm_usuario ADD (
--   apex_username VARCHAR2(100),
--   CONSTRAINT crm_usuario_uk_apex_usr UNIQUE (apex_username)
-- );
-- ─────────────────────────────────────────────────────────────────────────────
