-- ============================================================
-- CRM EXTRUCOL - ACTIVIDADES SEED DATA
-- 20 actividades variadas
-- ============================================================
INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO) VALUES
(1,  'LLAMADA', 'Llamada de seguimiento con director de obra. Muestra interés en recibir propuesta formal.',    'Interesado en propuesta. Solicita presupuesto formal para próxima semana.',         0, '2026-04-02', 1,  3, 1),
(2,  'REUNION', 'Reunión virtual con el equipo técnico del cliente para aclarar especificaciones.',           'Se requieren ajustes en especificación de tubería HDPE. Próxima llamada en 3 días.',  1, '2026-04-04', 2,  4, 1),
(3,  'VISITA',  'Visita de reconocimiento al terreno donde se desarrollará el proyecto.',                     'Terreno compatible con diseño. Solicitan visita del equipo técnico.',                 0, '2026-04-06', 3,  4, 1),
(4,  'CORREO',  'Envío de cotización formal con descuento del 8% por volumen.',                             'Cliente indica que comparar con otra cotización. Pendiente seguimiento.',             1, '2026-04-08', 4,  3, 1),
(5,  'LLAMADA', 'Seguimiento post-reunión. Cliente confirma presupuesto para junta directiva.',               'Presupuesto aprobado. Esperan fecha de inicio de obra.',                              0, '2026-04-10', 5,  3, 1),
(6,  'REUNION', 'Presentación técnica del proyecto de gasoducto ante equipo Ecopetrol.',                     'Requiere adicionales en tubería de acero. Se reprograma para ajuste de propuesta.',  1, '2026-04-12', 6,  4, 1),
(7,  'VISITA',  'Recorrido por sitio de instalación con ingeniero residente del cliente.',                    'Sitio accesible. Pendiente approval de ingeniería interna.',                           0, '2026-04-14', 7,  3, 1),
(8,  'CORREO',  'Envío de casos de éxito y referencias de proyectos similares.',                             'Cliente solicita contacto de referencias. Se proporcionaron 3 contactos.',              1, '2026-04-16', 8,  4, 1),
(9,  'LLAMADA', 'Negociación de volumen y formas de pago. Cliente propone plazos trimestrales.',              'Acuerdo en condiciones de pago. Pendiente firma de contrato.',                         0, '2026-04-18', 9,  3, 1),
(10, 'REUNION', 'Presentación de sistema presurizado ante equipo de compras.',                                'Tienen budget aprobado. Solicitan visita técnica para próximo martes.',                1, '2026-04-20', 10, 4, 1),
(11, 'VISITA',  'Inspección de terreno para planta de tratamiento de aguas.',                               'Terreno con restricciones ambientales. Se debe rediseñar.',                           0, '2026-04-22', 11, 3, 1),
(12, 'LLAMADA', 'Llamada de cierre para resolver últimas objeciones sobre garantía.',                       'Cliente satisfecho con garantía. Procede a firma.',                                    0, '2026-04-24', 12, 4, 1),
(13, 'CORREO',  'Confirmación de pedido y solicitud de fecha de despacho.',                                  'Despacho confirmado para primera semana de mayo.',                                    1, '2026-03-10', 13, 3, 1),
(14, 'REUNION', 'Reunión de cierre post-mortem del proyecto perdido en La Pintada.',                          'No hay recuperación. Se cerró oportunidad. Lecciones aprendidas documentadas.',        1, '2026-03-05', 14, 4, 1),
(15, 'LLAMADA', 'Llamada inicial de descubrimiento para proyecto de estación de bombeo.',                     'Necesidad real. Programar visita técnica para evaluar sitio.',                         0, '2026-04-28', 15, 3, 1),
(16, 'VISITA',  'Segunda visita técnica para mediciones finales de línea de conducción.',                     'Mediciones registradas. Pendiente informe de ingeniería.',                             0, '2026-04-05', 4,  3, 1),
(17, 'REUNION', 'Kickoff meeting del contrato anual de tuberías con representante del municipio.',            'Contrato firmado. Inicio de despachos el 1 de abril.',                                1, '2026-03-20', 13, 3, 1),
(18, 'CORREO',  'Envío de portafolio de productos y catálogo técnico actualizado.',                          'Cliente reprogramó evaluación para mayo. Seguimiento pendiente.',                      1, '2026-04-30', 3,  4, 1),
(19, 'LLAMADA', 'Seguimiento a oportunidad de cotización para distribuidor deBarrancabermeja.',              'Interesado en modalidad de distribuidor. Solicita propuesta comercial.',              0, '2026-05-01', 3,  3, 1),
(20, 'VISITA',  'Visita de cierre comercial con coordinador de compras del proyecto Palmeras.',                'Cierre técnicoconfirmado. Pendiente aprobación financiera.',                           0, '2026-05-02', 8,  4, 1);
COMMIT;