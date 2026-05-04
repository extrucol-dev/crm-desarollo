-- ============================================================
-- CRM EXTRUCOL - OPORTUNIDADES SEED DATA
-- 15 oportunidades en distintos estados
-- ============================================================
INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO) VALUES
(1,  'Licitación acueducto Bucaramanga',  'Licitación pública municipal para diseño y construcción del sistema de acueducto veredal',           'PROYECTO',   'NEGOCIACION', 560000000, '2026-04-30', 8, 3, 1),
(2,  'Proyecto acueducto rural',           'Construcción red de distribución para zona rural del municipio de Medellín',                            'PROYECTO',   'PROPUESTA',   485000000, '2026-04-25', 8, 4, 1),
(3,  'Suministro anual tubería',         'Contrato marco de suministro de tubería HDPE para proyectos de infraestructura',                    'VENTA',      'CALIFICACION', 420000000, '2026-05-15', 9, 4, 1),
(4,  'Línea conducción 8km',             'Diseño y suministro de línea de conducción en PVC para distrito de riego',                           'ACOMPANAMIENTO', 'NEGOCIACION', 380000000, '2026-05-05', 4, 3, 1),
(5,  'Ampliación red matriz',           'Ampliación de red matriz de acueducto zona norte de la ciudad',                                         'PROYECTO',   'CALIFICACION', 340000000, '2026-06-10', 1, 3, 1),
(6,  'Gasoducto Santa Marta',           'Instalación de red de gas natural para complejo residencial',                                          'VENTA',      'PROPUESTA',   320000000, '2026-05-20', 10, 4, 1),
(7,  'Red gas sector norte',            'Extensión de red de gas domiciliario sector norte de la ciudad',                                        'VENTA',      'NEGOCIACION', 280000000, '2026-05-08', 5, 3, 1),
(8,  'Sistema riego Palmeras',           'Sistema de riego tecnificado para plantación de palma de aceite',                                        'PROYECTO',   'PROPUESTA',   225000000, '2026-05-25', 7, 4, 1),
(9,  'Tubería industrial Ecopetrol',    'Suministro de tubería de acero al carbono para refinería',                                            'VENTA',      'CALIFICACION', 215000000, '2026-06-30', 9, 3, 1),
(10, 'Sistema presurizado',              'Sistema de presurización para red contra incendios en parque industrial',                               'VENTA',      'PROSPECTO',   180000000, '2026-05-20', 6, 4, 1),
(11, 'Planta tratamiento Bello',          'Planta de tratamiento de aguas residuales para municipio de Bello',                                      'PROYECTO',   'PROPUESTA',   520000000, '2026-06-15', 2, 3, 1),
(12, 'Red drenaje pluvial',              'Sistema de drenaje pluvial para proyecto urbanístico',                                                   'PROYECTO',   'CALIFICACION', 290000000, '2026-07-01', 3, 4, 1),
(13, 'Contrato anual tuberías',          'Contrato anual de suministro de tuberías PVC para varios municipios',                                    'VENTA',      'GANADA',      850000000, '2026-03-15', 4, 3, 1),
(14, 'Acueducto La Pintada',            'Proyecto de acueducto veredal para corregimiento La Pintada',                                         'PROYECTO',   'PERDIDA',     310000000, '2026-02-28', 6, 4, 1),
(15, 'Estación bombeo Floridablanca',   'Diseño y construcción de estación de bombeo para acueducto veredal',                                     'PROYECTO',   'PROSPECTO',   195000000, '2026-06-20', 1, 3, 1);
COMMIT;