-- ============================================================
-- CRM EXTRUCOL - LEADS SEED DATA
-- 10 leads de prueba
-- ============================================================
INSERT INTO CRM_LEADS (ID, NOMBRE, EMPRESA, EMAIL, TELEFONO, ORIGEN, SECTOR, CIUDAD_ID, DESCRIPCION, ESTADO, EJECUTIVO_ID, ACTIVO) VALUES
(1,  'Jorge Enrique Abello',   'Hidrotec SAS',           'jabello@hidrotec.com',        '3001112233', 'Referido',       'Agua Potable',    1, 'Interesado en sistema de acueducto municipal',           'CALIFICADO',   3, 1),
(2,  'Claudia Marcela Ríos',   'Inversiones Vías S.A.S.', 'crios@inversionesvias.com',   '3002223344', 'Web',             'Construcción',    2, 'Requiere cotización para proyecto vial',                  'NUEVO',       3, 1),
(3,  'Fernando José Castro',  'Aguas del Magdalena',     'fcastro@aguasdelmag.com',     '3003334455', 'Llamada fría',    'Agua Potable',    4, 'Gestión de residuos hídricos para municipio',           'CONTACTADO',   4, 1),
(4,  'Margarita Eugenia Prado','Proaguas del Valle',      'mprado@proaguasvalle.com',   '3004445566', 'Ferias',          'Agro / Riego',    3, 'Sistemas de riego para cultivos de palma',                 'NUEVO',       3, 1),
(5,  'Roberto Carlos Fuentes','Constructora Delta S.A.S.', 'rfuentes@deltaconstru.com',   '3005556677', 'Referido',       'Construcción',    5, 'Proyecto de infraestructura hidráulica',               'CALIFICADO',   4, 1),
(6,  'Andrea del Pilar Vega', 'Saneamiento Básico Andino','avega@sbandino.com',         '3006667788', 'Web',             'Agua Potable',    1, 'Planta de tratamiento de aguas residuales',            'CONTACTADO',   3, 1),
(7,  'Javier Andrés Moreno',   'Riego Tecnificado SAS',   'jmoreno@riegotecnificado.com', '3007778899', 'Llamada fría',   'Agro / Riego',    2, 'Expansión de frontera agrícola en el Valle',              'NUEVO',       3, 1),
(8,  'Liliana María Zapata',  'Acueducto Metropolitan',   'lzapata@acueductometro.com',   '3008889900', 'Ferias',          'Agua Potable',    4, 'Red de distribución para zona urbana',                 'CALIFICADO',   4, 1),
(9,  'Andrés Felipe Rubio',    'Insumos Agrícolas el Campo','arubio@insumoselcampo.com','3009990011', 'Referido',        'Agro / Riego',    7, 'Distribuidor de insumos para sistemas de riego',        'DESCARTADO',   3, 1),
(10, 'Sandra Milena Hernández','Obras Hidráulicas del Norte','shernandez@ohdn.com',     '3010101122', 'Llamada fría',    'Construcción',    1, 'Contracts for water infrastructure in Norte de Santander', 'CONTACTADO', 3, 1);
COMMIT;