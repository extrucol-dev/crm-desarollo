-- ============================================================
-- CRM EXTRUCOL - USUARIOS SEED DATA
-- 5 usuarios: admin, director, coordinador, 2 ejecutivos
-- ============================================================
INSERT INTO CRM_USUARIOS (ID, NOMBRE, EMAIL, ROL, TELEFONO, CIUDAD_ID, ACTIVO) VALUES (1, 'Carlos Muñoz',    'carlos.munoz@extrucol.com',    'DIRECTOR',    '3001234567', 1, 1);
INSERT INTO CRM_USUARIOS (ID, NOMBRE, EMAIL, ROL, TELEFONO, CIUDAD_ID, ACTIVO) VALUES (2, 'Diana Ruiz',       'diana.ruiz@extrucol.com',       'COORDINADOR', '3002345678', 1, 1);
INSERT INTO CRM_USUARIOS (ID, NOMBRE, EMAIL, ROL, TELEFONO, CIUDAD_ID, ACTIVO) VALUES (3, 'Juan Pérez',       'juan.perez@extrucol.com',       'EJECUTIVO',   '3003456789', 1, 1);
INSERT INTO CRM_USUARIOS (ID, NOMBRE, EMAIL, ROL, TELEFONO, CIUDAD_ID, ACTIVO) VALUES (4, 'María García',     'maria.garcia@extrucol.com',     'EJECUTIVO',   '3004567890', 2, 1);
INSERT INTO CRM_USUARIOS (ID, NOMBRE, EMAIL, ROL, TELEFONO, CIUDAD_ID, ACTIVO) VALUES (5, 'Admin Sistema',    'admin@extrucol.com',            'ADMIN',       '3005678901', 1, 1);
COMMIT;