-- ============================================================
-- CRM EXTRUCOL - CLIENTES SEED DATA
-- 10 empresas clientes
-- ============================================================
INSERT INTO CRM_CLIENTES (ID, NOMBRE, EMPRESA, SECTOR, EMAIL, TELEFONO, CIUDAD_ID, DIRECCION, EJECUTIVO_ID, ACTIVO) VALUES
(1,  'Carlos Rodríguez', 'INGEOMEGA SAS',       'Agua Potable',    'contacto@ingeomega.com',     '6012345678', 1, 'Calle 100 #15-30', 3, 1),
(2,  'Ana Martínez',    'CONSORCIO ING SANTA ELENA', 'Construcción', 'info@santaelena.com',         '6023456789', 2, 'Av. El Poblado 50', 4, 1),
(3,  'Pedro Salazar',   'RB DE COLOMBIA SA',    'Agua Potable',    'contacto@rbcolombia.com',     '6034567890', 3, 'Calle 5 #45-67', 3, 1),
(4,  'Laura Jiménez',   'CIVILE HIDRAULICOS',   'Construcción',    'ventas@civile.com',           '6045678901', 2, 'Cra 43A #1-50', 4, 1),
(5,  'Carlos Rodríguez', 'Promotora Imola Park',  'Construcción',    'info@imolapark.com',          '6056789012', 2, 'Av. Libertadores', 3, 1),
(6,  'Ana Martínez',    'ADOS INGENIERIA',       'Construcción',    'proyectos@ados.com',         '6067890123', 4, 'Calle 80 #45-30', 4, 1),
(7,  'Pedro Salazar',   'PROYECTOS MULTIPLES',  'Agro / Riego',    'contacto@proymult.com',       '6078901234', 1, 'Autopista Medellín', 3, 1),
(8,  'Laura Jiménez',   'EMPAS S.A.',            'Agua Potable',    'gerencia@empas.com',          '6089012345', 4, 'Calle 50 #21-45', 4, 1),
(9,  'Carlos Rodríguez','Constructora Andina',  'Construcción',    'ventas@andina.com.co',        '6010123456', 1, 'Av. Caracas 65-23', 3, 1),
(10, 'Ana Martínez',    'Distriaguas Caribe',    'Agua Potable',    'info@distriaguas.com',        '6011234567', 5, 'Vía 40 #55-22', 3, 1);
COMMIT;