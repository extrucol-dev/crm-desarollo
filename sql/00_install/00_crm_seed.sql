-- ============================================================
-- CRM EXTRUCOL - SEED DATA (FIXED)
-- Use ANSI date literals: DATE 'YYYY-MM-DD'
-- ============================================================

-- OPORTUNIDADES (15)
INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (1, 'Licitacion acueducto Bucaramanga', 'Licitacion publica municipal para diseno y construccion del sistema de acueducto veredal', 'PROYECTO', 'NEGOCIACION', 560000000, DATE '2026-04-30', 8, 3, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (2, 'Proyecto acueducto rural', 'Construccion red de distribucion para zona rural del municipio de Medellin', 'PROYECTO', 'PROPUESTA', 485000000, DATE '2026-04-25', 8, 4, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (3, 'Suministro anual tuberia', 'Contrato marco de suministro de tuberia HDPE para proyectos de infraestructura', 'VENTA', 'CALIFICACION', 420000000, DATE '2026-05-15', 9, 4, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (4, 'Linea conduccion 8km', 'Diseno y suministro de linea de conduccion en PVC para distrito de riego', 'ACOMPANAMIENTO', 'NEGOCIACION', 380000000, DATE '2026-05-05', 4, 3, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (5, 'Ampliacion red matriz', 'Ampliacion de red matriz de acueducto zona norte de la ciudad', 'PROYECTO', 'CALIFICACION', 340000000, DATE '2026-06-10', 1, 3, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (6, 'Gasoducto Santa Marta', 'Instalacion de red de gas natural para complejo residencial', 'VENTA', 'PROPUESTA', 320000000, DATE '2026-05-20', 10, 4, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (7, 'Red gas sector norte', 'Extension de red de gas domiciliario sector norte de la ciudad', 'VENTA', 'NEGOCIACION', 280000000, DATE '2026-05-08', 5, 3, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (8, 'Sistema riego Palmeras', 'Sistema de riego tecnificado para plantacion de palma de aceite', 'PROYECTO', 'PROPUESTA', 225000000, DATE '2026-05-25', 7, 4, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (9, 'Tuberia industrial Ecopetrol', 'Suministro de tuberia de acero al carbono para refineria', 'VENTA', 'CALIFICACION', 215000000, DATE '2026-06-30', 9, 3, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (10, 'Sistema presurizado', 'Sistema de presurizacion para red contra incendios en parque industrial', 'VENTA', 'PROSPECTO', 180000000, DATE '2026-05-20', 6, 4, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (11, 'Planta tratamiento Bello', 'Planta de tratamiento de aguas residuales para municipio de Bello', 'PROYECTO', 'PROPUESTA', 520000000, DATE '2026-06-15', 2, 3, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (12, 'Red drenaje pluvial', 'Sistema de drenaje pluvial para proyecto urbanistico', 'PROYECTO', 'CALIFICACION', 290000000, DATE '2026-07-01', 3, 4, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (13, 'Contrato anual tuberias', 'Contrato anual de suministro de tuberias PVC para varios municipios', 'VENTA', 'GANADA', 850000000, DATE '2026-03-15', 4, 3, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (14, 'Acueducto La Pintada', 'Proyecto de acueducto veredal para corregimiento La Pintada', 'PROYECTO', 'PERDIDA', 310000000, DATE '2026-02-28', 6, 4, 1);

INSERT INTO CRM_OPORTUNIDADES (ID, NOMBRE, DESCRIPCION, TIPO, ESTADO, VALOR_ESTIMADO, FECHA_CIERRE, CLIENTE_ID, EJECUTIVO_ID, ACTIVO)
VALUES (15, 'Estacion bombeo Floridablanca', 'Diseno y construccion de estacion de bombeo para acueducto veredal', 'PROYECTO', 'PROSPECTO', 195000000, DATE '2026-06-20', 1, 3, 1);

-- ACTIVIDADES (20)
INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (1, 'LLAMADA', 'Llamada de seguimiento con director de obra. Muestra interes en recibir propuesta formal.', 'Interesado en propuesta. Solicita presupuesto formal para proxima semana.', 0, DATE '2026-04-02', 1, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (2, 'REUNION', 'Reunion virtual con el equipo tecnico del cliente para aclarar especificaciones.', 'Se requieren ajustes en especificacion de tuberia HDPE. Proxima llamada en 3 dias.', 1, DATE '2026-04-04', 2, 4, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (3, 'VISITA', 'Visita de reconocimiento al terreno donde se desarrollara el proyecto.', 'Terreno compatible con diseno. Solicitan visita del equipo tecnico.', 0, DATE '2026-04-06', 3, 4, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (4, 'CORREO', 'Envio de cotizacion formal con descuento del 8 por volumen.', 'Cliente indica que comparar con otra cotizacion. Pendiente seguimiento.', 1, DATE '2026-04-08', 4, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (5, 'LLAMADA', 'Seguimiento post-reunion. Cliente confirma presupuesto para junta directiva.', 'Presupuesto aprobado. Esperan fecha de inicio de obra.', 0, DATE '2026-04-10', 5, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (6, 'REUNION', 'Presentacion tecnica del proyecto de gasoducto ante equipo Ecopetrol.', 'Requiere adicionales en tuberia de acero. Se reprograma para ajuste de propuesta.', 1, DATE '2026-04-12', 6, 4, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (7, 'VISITA', 'Recorrido por sitio de instalacion con ingeniero residente del cliente.', 'Sitio accesible. Pendiente approval de ingenieria interna.', 0, DATE '2026-04-14', 7, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (8, 'CORREO', 'Envio de casos de exito y referencias de proyectos similares.', 'Cliente solicita contacto de referencias. Se proporcionaron 3 contactos.', 1, DATE '2026-04-16', 8, 4, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (9, 'LLAMADA', 'Negociacion de volumen y formas de pago. Cliente propone plazos trimestrales.', 'Acuerdo en condiciones de pago. Pendiente firma de contrato.', 0, DATE '2026-04-18', 9, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (10, 'REUNION', 'Presentacion de sistema presurizado ante equipo de compras.', 'Tienen budget aprobado. Solicitan visita tecnica para proximo martes.', 1, DATE '2026-04-20', 10, 4, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (11, 'VISITA', 'Inspeccion de terreno para planta de tratamiento de aguas.', 'Terreno con restricciones ambientales. Se debe redisenar.', 0, DATE '2026-04-22', 11, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (12, 'LLAMADA', 'Llamada de cierre para resolver ultimas objeciones sobre garantia.', 'Cliente satisfecho con garantia. Procede a firma.', 0, DATE '2026-04-24', 12, 4, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (13, 'CORREO', 'Confirmacion de pedido y solicitud de fecha de despacho.', 'Despacho confirmado para primera semana de mayo.', 1, DATE '2026-03-10', 13, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (14, 'REUNION', 'Reunion de cierre post-mortem del proyecto perdido en La Pintada.', 'No hay recuperacion. Se cerro oportunidad. Lecciones aprendidas documentadas.', 1, DATE '2026-03-05', 14, 4, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (15, 'LLAMADA', 'Llamada inicial de descubrimiento para proyecto de estacion de bombeo.', 'Necesidad real. Programar visita tecnica para evaluar sitio.', 0, DATE '2026-04-28', 15, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (16, 'VISITA', 'Segunda visita tecnica para mediciones finales de linea de conduccion.', 'Mediciones registradas. Pendiente informe de ingenieria.', 0, DATE '2026-04-05', 4, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (17, 'REUNION', 'Kickoff meeting del contrato anual de tuberias con representante del municipio.', 'Contrato firmado. Inicio de despachos el 1 de abril.', 1, DATE '2026-03-20', 13, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (18, 'CORREO', 'Envio de portafolio de productos y catalogo tecnico actualizado.', 'Cliente reprogramo evaluacion para mayo. Seguimiento pendiente.', 1, DATE '2026-04-30', 3, 4, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (19, 'LLAMADA', 'Seguimiento a oportunidad de cotizacion para distribuidor de Barrancabermeja.', 'Interesado en modalidad de distribuidor. Solicita propuesta comercial.', 0, DATE '2026-05-01', 3, 3, 1);

INSERT INTO CRM_ACTIVIDADES (ID, TIPO, DESCRIPCION, RESULTADO, VIRTUAL, FECHA_ACTIVIDAD, OPORTUNIDAD_ID, EJECUTIVO_ID, ACTIVO)
VALUES (20, 'VISITA', 'Visita de cierre comercial con coordinador de compras del proyecto Palmeras.', 'Cierre tecnico confirmado. Pendiente aprobacion financiera.', 0, DATE '2026-05-02', 8, 4, 1);

-- PROYECTOS (3)
INSERT INTO CRM_PROYECTOS (ID, NOMBRE, DESCRIPCION, ESTADO, OPORTUNIDAD_ID, FECHA_INICIO, FECHA_FIN, ACTIVO)
VALUES (1, 'Contrato anual tuberias Bucaramanga', 'Suministro trimestral de tuberias PVC y HDPE para proyectos municipales', 'ACTIVO', 13, DATE '2026-03-15', DATE '2027-03-15', 1);

INSERT INTO CRM_PROYECTOS (ID, NOMBRE, DESCRIPCION, ESTADO, OPORTUNIDAD_ID, FECHA_INICIO, FECHA_FIN, ACTIVO)
VALUES (2, 'Acueducto rural Medellin', 'Diseno y construccion de red de distribucion para zona rural veredal', 'ACTIVO', 2, DATE '2026-04-01', NULL, 1);

INSERT INTO CRM_PROYECTOS (ID, NOMBRE, DESCRIPCION, ESTADO, OPORTUNIDAD_ID, FECHA_INICIO, FECHA_FIN, ACTIVO)
VALUES (3, 'Sistema presurizado zona industrial', 'Instalacion de sistema contra incendios en parque industrial', 'FINALIZADO', 10, DATE '2026-02-01', DATE '2026-04-15', 1);

-- ALERTAS (5)
INSERT INTO CRM_ALERTAS (ID, TITULO, MENSAJE, TIPO, USUARIO_ID, ESTADO, FECHA_ALERTA)
VALUES (1, 'Oportunidad estancada', 'Licitacion acueducto Bucaramanga lleva mas de 15 dias sin actividad. Avanza o cierra.', 'WARNING', 3, 'LEIDA', DATE '2026-04-20');

INSERT INTO CRM_ALERTAS (ID, TITULO, MENSAJE, TIPO, USUARIO_ID, ESTADO, FECHA_ALERTA)
VALUES (2, 'Meta de abril en riesgo', 'Llevas 3 de 5 oportunidades cerradas. Alcanza tu meta antes del 30.', 'WARNING', 3, 'PENDIENTE', DATE '2026-04-28');

INSERT INTO CRM_ALERTAS (ID, TITULO, MENSAJE, TIPO, USUARIO_ID, ESTADO, FECHA_ALERTA)
VALUES (3, 'Actividad completada', 'Registro de visita tecnica completado exitosamente.', 'INFO', 3, 'LEIDA', DATE '2026-04-14');

INSERT INTO CRM_ALERTAS (ID, TITULO, MENSAJE, TIPO, USUARIO_ID, ESTADO, FECHA_ALERTA)
VALUES (4, 'Oportunidad ganada', 'Felicidades. Contrato anual tuberias Bucaramanga cerrado por 850M.', 'INFO', 3, 'PENDIENTE', DATE '2026-04-15');

INSERT INTO CRM_ALERTAS (ID, TITULO, MENSAJE, TIPO, USUARIO_ID, ESTADO, FECHA_ALERTA)
VALUES (5, 'Lead sin seguimiento', 'Carlos Mendoza (Constructora Mendoza) tiene leads sin contacto en 7 dias.', 'WARNING', 4, 'PENDIENTE', DATE '2026-04-28');

COMMIT;