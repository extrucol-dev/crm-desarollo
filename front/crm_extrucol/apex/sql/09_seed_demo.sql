-- =============================================================================
-- CRM EXTRUCOL — SEED DATA: Usuarios y datos de demostración
-- Ejecutar DESPUÉS de 07_seed_reference.sql y 08_ddl_indexes.sql
-- =============================================================================
--
-- IMPORTANTE: Ajusta los apex_username para que coincidan exactamente
-- con los usernames del APEX Workspace (se ve en Manage Users and Groups).
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CRM_USUARIO
-- password = 'APEX_MANAGED' porque la autenticación la gestiona APEX.
-- apex_username DEBE coincidir exactamente (case-insensitive en la lógica,
-- pero guárdalo como aparece en el workspace para claridad).
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_usuario (id_usuario, nombre, email, apex_username, password, rol, activo, id_departamento)
VALUES (1, 'Director Comercial', 'director@extrucol.com', 'DIRECTOR.CRM', 'APEX_MANAGED', 'DIRECTOR', 1, 103);

INSERT INTO crm_usuario (id_usuario, nombre, email, apex_username, password, rol, activo, id_departamento)
VALUES (2, 'Coordinadora de Seguimiento', 'coordinadora@extrucol.com', 'COORDINADORA.CRM', 'APEX_MANAGED', 'COORDINADOR', 1, 103);

INSERT INTO crm_usuario (id_usuario, nombre, email, apex_username, password, rol, activo, id_departamento)
VALUES (3, 'René Villazón', 'rene.villazon@extrucol.com', 'RENE.VILLAZON', 'APEX_MANAGED', 'EJECUTIVO', 1, 103);

INSERT INTO crm_usuario (id_usuario, nombre, email, apex_username, password, rol, activo, id_departamento)
VALUES (4, 'Laura Martínez', 'laura.martinez@extrucol.com', 'LAURA.MARTINEZ', 'APEX_MANAGED', 'EJECUTIVO', 1, 120);

INSERT INTO crm_usuario (id_usuario, nombre, email, apex_username, password, rol, activo, id_departamento)
VALUES (5, 'Carlos Ospina', 'carlos.ospina@extrucol.com', 'CARLOS.OSPINA', 'APEX_MANAGED', 'EJECUTIVO', 1, 101);

INSERT INTO crm_usuario (id_usuario, nombre, email, apex_username, password, rol, activo, id_departamento)
VALUES (6, 'Administrador CRM', 'admin@extrucol.com', 'ADMIN.CRM', 'APEX_MANAGED', 'ADMINISTRADOR', 1, 103);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. CRM_EMPRESA  (clientes / prospectos de Extrucol)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_empresa (id_empresa, nombre, no_documento, activo, nuevo, id_municipio, id_documento, id_modalidad)
VALUES (1, 'Acueducto y Alcantarillado de Bogotá E.S.P.', '800.149.826-8', 1, 0, 10009, 101, 101);

INSERT INTO crm_empresa (id_empresa, nombre, no_documento, activo, nuevo, id_municipio, id_documento, id_modalidad)
VALUES (2, 'Empresas Públicas de Medellín E.S.P.', '890.904.996-1', 1, 0, 10001, 101, 101);

INSERT INTO crm_empresa (id_empresa, nombre, no_documento, activo, nuevo, id_municipio, id_documento, id_modalidad)
VALUES (3, 'Aguas de Manizales S.A. E.S.P.', '890.806.490-9', 1, 1, 10017, 101, 101);

INSERT INTO crm_empresa (id_empresa, nombre, no_documento, activo, nuevo, id_municipio, id_documento, id_modalidad)
VALUES (4, 'Constructora Colpatria S.A.S.', '860.015.014-0', 1, 0, 10009, 101, 101);

INSERT INTO crm_empresa (id_empresa, nombre, no_documento, activo, nuevo, id_municipio, id_documento, id_modalidad)
VALUES (5, 'Hacienda El Vergel (Agro/Riego)', '901.234.567-8', 1, 1, 10038, 101, 101);

INSERT INTO crm_empresa (id_empresa, nombre, no_documento, activo, nuevo, id_municipio, id_documento, id_modalidad)
VALUES (6, 'Gas Natural del Centro S.A. E.S.P.', '890.103.127-3', 1, 1, 10050, 101, 101);

INSERT INTO crm_empresa (id_empresa, nombre, no_documento, activo, nuevo, id_municipio, id_documento, id_modalidad)
VALUES (7, 'Planta de Tratamiento Aguas de Cali', '890.302.222-5', 1, 0, 10059, 101, 101);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. CRM_CONTACTO
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_contacto (id_contacto, nombre, apellido, cargo, es_principal, activo, id_empresa)
VALUES (1, 'Gerente', 'Técnico EAAB', 'Gerente de Proyectos', 1, 1, 1);

INSERT INTO crm_contacto (id_contacto, nombre, apellido, cargo, es_principal, activo, id_empresa)
VALUES (2, 'Jefe', 'de Compras EPM', 'Jefe de Compras', 1, 1, 2);

INSERT INTO crm_contacto (id_contacto, nombre, apellido, cargo, es_principal, activo, id_empresa)
VALUES (3, 'Ingeniero', 'de Proyectos Manizales', 'Ingeniero Civil Senior', 1, 1, 3);

INSERT INTO crm_contacto (id_contacto, nombre, apellido, cargo, es_principal, activo, id_empresa)
VALUES (4, 'Director', 'de Compras Colpatria', 'Director de Adquisiciones', 1, 1, 4);

INSERT INTO crm_contacto (id_contacto, nombre, apellido, cargo, es_principal, activo, id_empresa)
VALUES (5, 'Propietario', 'Hacienda El Vergel', 'Propietario', 1, 1, 5);

INSERT INTO crm_contacto (id_contacto, nombre, apellido, cargo, es_principal, activo, id_empresa)
VALUES (6, 'Gerente', 'Gas Natural Centro', 'Gerente de Operaciones', 1, 1, 6);

INSERT INTO crm_contacto (id_contacto, nombre, apellido, cargo, es_principal, activo, id_empresa)
VALUES (7, 'Supervisor', 'Planta Cali', 'Supervisor de Planta', 1, 1, 7);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. CRM_EMAIL y CRM_TELEFONO
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_email    (id_email, email, id_contacto) VALUES (1, 'gerencia.tecnica@acueducto.com.co', 1);
INSERT INTO crm_email    (id_email, email, id_contacto) VALUES (2, 'compras@epm.com.co', 2);
INSERT INTO crm_email    (id_email, email, id_contacto) VALUES (3, 'proyectos@aguasmanizales.com', 3);
INSERT INTO crm_email    (id_email, email, id_contacto) VALUES (4, 'adquisiciones@colpatria.com', 4);
INSERT INTO crm_email    (id_email, email, id_contacto) VALUES (5, 'haciendaelvergel@gmail.com', 5);
INSERT INTO crm_email    (id_email, email, id_contacto) VALUES (6, 'operaciones@gasnatural.com.co', 6);
INSERT INTO crm_email    (id_email, email, id_contacto) VALUES (7, 'planta.cali@aguascali.com', 7);

INSERT INTO crm_telefono (id_telefono, numero, id_contacto) VALUES (1, '601-3680000', 1);
INSERT INTO crm_telefono (id_telefono, numero, id_contacto) VALUES (2, '604-3800800', 2);
INSERT INTO crm_telefono (id_telefono, numero, id_contacto) VALUES (3, '606-8843590', 3);
INSERT INTO crm_telefono (id_telefono, numero, id_contacto) VALUES (4, '601-6550550', 4);
INSERT INTO crm_telefono (id_telefono, numero, id_contacto) VALUES (5, '318-7291145', 5);
INSERT INTO crm_telefono (id_telefono, numero, id_contacto) VALUES (6, '607-6343000', 6);
INSERT INTO crm_telefono (id_telefono, numero, id_contacto) VALUES (7, '602-8985900', 7);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. CRM_LEAD  (pipeline de leads para el ejecutivo René)
-- ─────────────────────────────────────────────────────────────────────────────
-- Estado: 101=Nuevo, 102=Contactado, 103=Interesado, 104=No Interesado
-- Origen: 101=WhatsApp, 102=Instagram, 104=Web, 105=Referido, 107=Llamada

INSERT INTO crm_lead (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
                      nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario)
VALUES (1, 'Sistema de riego tecnificado Llanos Orientales',
        'Hacienda de 500 ha busca riego por goteo para cultivos de maíz y soya',
        72, 103, 105, 'Agrícola San Pedro S.A.S.', 'Jesús Pérez', '312-8456721', 'jperez@agriosanpedro.com', 3);

INSERT INTO crm_lead (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
                      nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario)
VALUES (2, 'Red de conducción agua potable municipio',
        'Alcaldía requiere cotización para 12km de tubería PE100 para expansión de acueducto',
        60, 102, 107, 'Alcaldía de Mosquera', 'Ing. Rodríguez', '601-8229900', 'obras@mosquera.gov.co', 3);

INSERT INTO crm_lead (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
                      nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario)
VALUES (3, 'Ampliación red distribución gas natural',
        'Empresa de gas requiere tubería PE80 para expansión urbana en barrios nuevos',
        45, 101, 104, 'Gases del Norte S.A. E.S.P.', 'Carlos Valencia', '607-5740000', 'cvalencia@gasesnorte.com', 3);

INSERT INTO crm_lead (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
                      nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario)
VALUES (4, 'Proyecto PTAR municipio mediano',
        'Consultoría ambiental buscando proveedor de tuberías para planta de tratamiento',
        35, 101, 102, 'Aguas y Ambiente S.A.S.', 'María Torres', '315-9087432', 'mtorres@aguasambiente.com', 4);

INSERT INTO crm_lead (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
                      nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario)
VALUES (5, 'Suministro accesorios PE Bogotá',
        'Empresa constructora necesita accesorios PE para redes internas de conjunto residencial',
        25, 104, 101, 'Construir y Vivir S.A.S.', 'Pedro Gómez', '310-2345678', 'pgomez@construirvivir.com', 3);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. CRM_LEAD_INTERES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_lead_interes (id_lead_interes, id_lead, id_interes) VALUES (1, 1, 103);  -- Riego
INSERT INTO crm_lead_interes (id_lead_interes, id_lead, id_interes) VALUES (2, 1, 104);  -- Válvulas
INSERT INTO crm_lead_interes (id_lead_interes, id_lead, id_interes) VALUES (3, 2, 101);  -- Tubería PE100
INSERT INTO crm_lead_interes (id_lead_interes, id_lead, id_interes) VALUES (4, 3, 101);  -- Tubería PE100
INSERT INTO crm_lead_interes (id_lead_interes, id_lead, id_interes) VALUES (5, 3, 102);  -- Accesorios PE
INSERT INTO crm_lead_interes (id_lead_interes, id_lead, id_interes) VALUES (6, 4, 101);  -- Tubería PE100
INSERT INTO crm_lead_interes (id_lead_interes, id_lead, id_interes) VALUES (7, 5, 102);  -- Accesorios PE

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. CRM_OPORTUNIDAD
-- Estado: 101=Prospección, 102=Calificación, 103=Especificación, 104=Negociación, 105=Ganada, 106=Perdida
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_oportunidad (id_oportunidad, titulo, descripcion, id_tipo_oportunidad, id_estado_oportunidad,
                              valor_estimado, probabilidad_cierre, id_sector, fecha_cierre_estimada,
                              id_empresa, id_usuario)
VALUES (1, 'Suministro tubería PE100 EAAB 2025',
        'Suministro de 25.000m tubería PE100 RD11 para red de distribución en zona norte Bogotá',
        102, 104, 890000000, 75, 101,
        DATE '2025-08-30', 1, 3);

INSERT INTO crm_oportunidad (id_oportunidad, titulo, descripcion, id_tipo_oportunidad, id_estado_oportunidad,
                              valor_estimado, probabilidad_cierre, id_sector, fecha_cierre_estimada,
                              id_empresa, id_usuario)
VALUES (2, 'Licitación accesorios PE EPM Antioquia',
        'Licitación pública para suministro de accesorios PE para expansión de acueducto en 3 municipios',
        101, 103, 420000000, 50, 101,
        DATE '2025-09-15', 2, 3);

INSERT INTO crm_oportunidad (id_oportunidad, titulo, descripcion, id_tipo_oportunidad, id_estado_oportunidad,
                              valor_estimado, probabilidad_cierre, id_sector, fecha_cierre_estimada,
                              id_empresa, id_usuario)
VALUES (3, 'Sistema riego tecnificado Hacienda El Vergel',
        'Diseño y suministro sistema riego por goteo 500ha con válvulas y electroválvulas',
        103, 102, 320000000, 60, 103,
        DATE '2025-07-31', 5, 3);

INSERT INTO crm_oportunidad (id_oportunidad, titulo, descripcion, id_tipo_oportunidad, id_estado_oportunidad,
                              valor_estimado, probabilidad_cierre, id_sector, fecha_cierre_estimada,
                              id_empresa, id_usuario)
VALUES (4, 'Expansión red gas natural Bucaramanga',
        'Suministro 8.000m tubería PE80 para extensión red distribución domiciliaria',
        102, 101, 185000000, 30, 102,
        DATE '2025-10-31', 6, 4);

INSERT INTO crm_oportunidad (id_oportunidad, titulo, descripcion, id_tipo_oportunidad, id_estado_oportunidad,
                              valor_estimado, probabilidad_cierre, id_sector, fecha_cierre_estimada,
                              id_empresa, id_usuario, id_motivo_cierre, descripcion_cierre)
VALUES (5, 'Tubería PTAR Cali ampliación 2024',
        'Suministro tubería para planta de tratamiento aguas residuales sector industrial',
        102, 105, 560000000, 100, 105,
        DATE '2024-12-15', 7, 5, 101, 'Proyecto adjudicado en diciembre 2024. Entrega completada.');

INSERT INTO crm_oportunidad (id_oportunidad, titulo, descripcion, id_tipo_oportunidad, id_estado_oportunidad,
                              valor_estimado, probabilidad_cierre, id_sector, fecha_cierre_estimada,
                              id_empresa, id_usuario, id_motivo_cierre, descripcion_cierre)
VALUES (6, 'Accesorios Colpatria proyecto residencial',
        'Accesorios PE para red interna conjunto de 240 apartamentos',
        102, 106, 95000000, 0, 104,
        DATE '2024-11-30', 4, 3, 104, 'El cliente decidió comprar a distribuidor local por precio');

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. CRM_ACTIVIDAD
-- tipo: VISITA | LLAMADA | REUNION | EMAIL
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_actividad (id_actividad, tipo, asunto, descripcion, resultado, virtual, fecha_actividad, id_oportunidad, id_usuario)
VALUES (1, 'REUNION', 'Presentación técnica EAAB',
        'Reunión con equipo de proyectos para presentar catálogo PE100 y casos de éxito',
        'Muy buena recepción. Solicitaron cotización formal para 25.000m.',
        1, DATE '2025-04-28', 1, 3);

INSERT INTO crm_actividad (id_actividad, tipo, asunto, descripcion, resultado, virtual, fecha_actividad, id_oportunidad, id_usuario)
VALUES (2, 'VISITA', 'Visita obra acueducto norte Bogotá',
        'Recorrido de obra para entender especificaciones técnicas del proyecto EAAB',
        'Se identificaron necesidades adicionales de accesorios. Ampliar cotización.',
        0, DATE '2025-05-02', 1, 3);

INSERT INTO crm_actividad (id_actividad, tipo, asunto, descripcion, resultado, virtual, fecha_actividad, id_oportunidad, id_usuario)
VALUES (3, 'LLAMADA', 'Seguimiento propuesta EPM',
        'Llamada para verificar estado de evaluación de la propuesta técnica enviada',
        'Confirman que están en proceso de evaluación de 3 propuestas. Nos piden precio final.',
        0, DATE '2025-05-01', 2, 3);

INSERT INTO crm_actividad (id_actividad, tipo, asunto, descripcion, resultado, virtual, fecha_actividad, id_oportunidad, id_usuario)
VALUES (4, 'VISITA', 'Visita técnica Hacienda El Vergel',
        'Levantamiento topográfico y evaluación de necesidades de riego en las 500 hectáreas',
        'Definimos que se necesitan 3 sectores de riego independientes. Solicitaron propuesta detallada.',
        0, DATE '2025-04-25', 3, 3);

INSERT INTO crm_actividad (id_actividad, tipo, asunto, descripcion, resultado, virtual, fecha_actividad, id_oportunidad, id_usuario)
VALUES (5, 'EMAIL', 'Envío cotización Gas Natural Bucaramanga',
        'Cotización formal con especificaciones técnicas y precios para 8.000m PE80',
        NULL,
        0, DATE '2025-05-05', 4, 4);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 9. CRM_UBICACION  (GPS de visitas presenciales)
-- ─────────────────────────────────────────────────────────────────────────────
-- Actividad 2: Obra norte Bogotá (coordenadas aproximadas)
INSERT INTO crm_ubicacion (id_ubicacion, latitud, longitud, precision_m, direccion, id_actividad)
VALUES (1, 4.7290000, -74.0500000, 15, 'Cra 7 con Calle 170, Bogotá D.C.', 2);

-- Actividad 4: Hacienda El Vergel, Meta
INSERT INTO crm_ubicacion (id_ubicacion, latitud, longitud, precision_m, direccion, id_actividad)
VALUES (2, 4.0840000, -73.5740000, 25, 'Vía Puerto López km 18, Meta', 4);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 10. CRM_PROYECTO  (generado desde oportunidad ganada)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_proyecto (id_proyecto, nombre, descripcion, estado, porcentaje_completado,
                           fecha_inicio, fecha_fin, id_oportunidad, id_usuario)
VALUES (1, 'Entrega tubería PTAR Cali 2024-2025',
        'Suministro y entrega de tubería para planta de tratamiento aguas residuales sector industrial de Cali',
        'EN_EJECUCION', 65,
        DATE '2025-01-10', DATE '2025-07-31', 5, 5);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 11. CRM_PROYECTO_HITO
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_proyecto_hito (id_hito, id_proyecto, titulo, descripcion, estado, orden, fecha_planificada, fecha_completado)
VALUES (1, 1, 'Orden de compra recibida', 'Cliente firma y entrega OC oficial', 'COMPLETADO', 1, DATE '2025-01-15', DATE '2025-01-14');

INSERT INTO crm_proyecto_hito (id_hito, id_proyecto, titulo, descripcion, estado, orden, fecha_planificada, fecha_completado)
VALUES (2, 1, 'Producción en planta', 'Fabricación del lote de tubería PE100', 'COMPLETADO', 2, DATE '2025-03-01', DATE '2025-02-28');

INSERT INTO crm_proyecto_hito (id_hito, id_proyecto, titulo, descripcion, estado, orden, fecha_planificada)
VALUES (3, 1, 'Primer despacho', 'Envío de 60% del pedido vía camión', 'EN_CURSO', 3, DATE '2025-05-15');

INSERT INTO crm_proyecto_hito (id_hito, id_proyecto, titulo, descripcion, estado, orden, fecha_planificada)
VALUES (4, 1, 'Segundo despacho y cierre', 'Entrega restante y acta de recibo', 'PENDIENTE', 4, DATE '2025-07-15');

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 12. CRM_META  (metas del período actual — mayo 2025)
-- ─────────────────────────────────────────────────────────────────────────────
-- Meta global para todos los ejecutivos (id_usuario = NULL)
INSERT INTO crm_meta (id_meta, nombre, descripcion, tipo, metrica, valor_meta, unidad, periodo, activo, id_usuario, id_creado_por)
VALUES (1, 'Ventas mensuales equipo',
        'Meta de ventas consolidada del equipo comercial para el mes',
        'SISTEMA', 'VENTAS_MES', 1500000000, 'COP', 'MENSUAL', 1, NULL, 1);

-- Metas individuales ejecutivos
INSERT INTO crm_meta (id_meta, nombre, descripcion, tipo, metrica, valor_meta, unidad, periodo, activo, id_usuario, id_creado_por)
VALUES (2, 'Ventas mensuales René',
        'Meta de facturación del ejecutivo René Villazón para mayo 2025',
        'SISTEMA', 'VENTAS_MES', 500000000, 'COP', 'MENSUAL', 1, 3, 1);

INSERT INTO crm_meta (id_meta, nombre, descripcion, tipo, metrica, valor_meta, unidad, periodo, activo, id_usuario, id_creado_por)
VALUES (3, 'Actividades semanales René',
        'Mínimo de actividades de campo para el ejecutivo',
        'SISTEMA', 'ACTIVIDADES_SEMANA', 8, 'CANTIDAD', 'SEMANAL', 1, 3, 1);

INSERT INTO crm_meta (id_meta, nombre, descripcion, tipo, metrica, valor_meta, unidad, periodo, activo, id_usuario, id_creado_por)
VALUES (4, 'Ventas mensuales Laura',
        'Meta de facturación de Laura Martínez para mayo 2025',
        'SISTEMA', 'VENTAS_MES', 350000000, 'COP', 'MENSUAL', 1, 4, 1);

INSERT INTO crm_meta (id_meta, nombre, descripcion, tipo, metrica, valor_meta, unidad, periodo, activo, id_usuario, id_creado_por)
VALUES (5, 'Ventas mensuales Carlos',
        'Meta de facturación de Carlos Ospina para mayo 2025',
        'SISTEMA', 'VENTAS_MES', 300000000, 'COP', 'MENSUAL', 1, 5, 1);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 13. CRM_CUMPLIMIENTO_META  (período: mayo 2025)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_cumplimiento_meta (id_cumplimiento, id_meta, id_usuario, mes, anio, valor_actual, valor_meta_snap, pct_cumplimiento)
VALUES (1, 2, 3, 5, 2025, 340000000, 500000000, 68.00);

INSERT INTO crm_cumplimiento_meta (id_cumplimiento, id_meta, id_usuario, mes, anio, valor_actual, valor_meta_snap, pct_cumplimiento)
VALUES (2, 3, 3, 5, 2025, 5, 8, 62.50);

INSERT INTO crm_cumplimiento_meta (id_cumplimiento, id_meta, id_usuario, mes, anio, valor_actual, valor_meta_snap, pct_cumplimiento)
VALUES (3, 4, 4, 5, 2025, 185000000, 350000000, 52.86);

INSERT INTO crm_cumplimiento_meta (id_cumplimiento, id_meta, id_usuario, mes, anio, valor_actual, valor_meta_snap, pct_cumplimiento)
VALUES (4, 5, 5, 5, 2025, 280000000, 300000000, 93.33);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 14. CRM_NOTIFICACION  (alertas de demostración)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_notificacion (id_notificacion, id_usuario_destino, tipo, titulo, mensaje, canal, leida, id_oportunidad)
VALUES (1, 3, 'ADVERTENCIA', 'Oportunidad EPM sin actividad',
        'La oportunidad "Licitación accesorios PE EPM Antioquia" lleva 4 días sin actividad registrada. Se recomienda contactar al cliente.',
        'APP', 0, 2);

INSERT INTO crm_notificacion (id_notificacion, id_usuario_destino, tipo, titulo, mensaje, canal, leida, id_oportunidad)
VALUES (2, 2, 'CRITICA', 'Lead sin contactar: Gas Natural Bucaramanga',
        'El lead "Ampliación red distribución gas natural" lleva 5 días en estado Nuevo sin ser contactado.',
        'APP', 0, NULL);

INSERT INTO crm_notificacion (id_notificacion, id_usuario_destino, tipo, titulo, mensaje, canal, leida)
VALUES (3, 3, 'EXITO', 'Meta de ventas: 68% alcanzado',
        '¡Vas bien! Has alcanzado el 68% de tu meta mensual de ventas con $340M de $500M.',
        'APP', 1);

INSERT INTO crm_notificacion (id_notificacion, id_usuario_destino, tipo, titulo, mensaje, canal, leida)
VALUES (4, 2, 'ADVERTENCIA', 'Carlos Ospina: actividades por debajo del plan',
        'Carlos Ospina tiene 5 actividades esta semana vs. las 8 planeadas. Verificar agenda.',
        'APP', 0);

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 15. HISTORIAL_ESTADO_LEAD  (cambios de estado de leads)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_historial_estado_lead (id_historial_lead, id_lead, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (1, 1, NULL, 101, 3, 'Lead registrado vía referido de cliente EPM');

INSERT INTO crm_historial_estado_lead (id_historial_lead, id_lead, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (2, 1, 101, 102, 3, 'Primer contacto por WhatsApp realizado');

INSERT INTO crm_historial_estado_lead (id_historial_lead, id_lead, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (3, 1, 102, 103, 3, 'Cliente muestra interés real. Visita técnica agendada para la próxima semana.');

INSERT INTO crm_historial_estado_lead (id_historial_lead, id_lead, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (4, 5, NULL, 101, 3, 'Lead registrado por WhatsApp');

INSERT INTO crm_historial_estado_lead (id_historial_lead, id_lead, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (5, 5, 101, 104, 3, 'Cliente indicó que ya compró a distribuidor local. Se descalifica.');

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 16. HISTORIAL_ESTADO  (pipeline de oportunidades)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_historial_estado (id_historial, id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (1, 1, NULL, 101, 3, 'Oportunidad creada a partir de reunión inicial con EAAB');

INSERT INTO crm_historial_estado (id_historial, id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (2, 1, 101, 102, 3, 'Calificada: presupuesto confirmado y alineación técnica verificada');

INSERT INTO crm_historial_estado (id_historial, id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (3, 1, 102, 103, 3, 'Especificaciones técnicas entregadas. En revisión por ingeniería de EAAB.');

INSERT INTO crm_historial_estado (id_historial, id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (4, 1, 103, 104, 3, 'Propuesta económica aceptada en principio. Negociando condiciones de pago.');

INSERT INTO crm_historial_estado (id_historial, id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (5, 5, NULL, 101, 5, 'Oportunidad registrada tras visita a planta de Cali');

INSERT INTO crm_historial_estado (id_historial, id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (6, 5, 101, 105, 5, 'Proyecto ganado. Orden de compra firmada en diciembre 2024.');

INSERT INTO crm_historial_estado (id_historial, id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (7, 6, NULL, 101, 3, 'Oportunidad registrada tras cotización a Colpatria');

INSERT INTO crm_historial_estado (id_historial, id_oportunidad, id_estado_anterior, id_estado_nuevo, id_usuario, comentario)
VALUES (8, 6, 101, 106, 3, 'Perdida: cliente compró a distribuidor local con menor precio por volumen reducido.');

COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICACIÓN RÁPIDA
-- ─────────────────────────────────────────────────────────────────────────────
-- Descomentar para verificar en SQL Workshop:
--
-- SELECT u.nombre, u.rol, u.apex_username
--   FROM crm_usuario u ORDER BY u.rol, u.nombre;
--
-- SELECT e.nombre AS empresa, COUNT(o.id_oportunidad) AS opps,
--        SUM(o.valor_estimado) AS valor_total
--   FROM crm_empresa e
--   LEFT JOIN crm_oportunidad o ON o.id_empresa = e.id_empresa
--  GROUP BY e.nombre ORDER BY valor_total DESC NULLS LAST;
--
-- SELECT u.nombre AS ejecutivo,
--        COUNT(l.id_lead) AS leads,
--        COUNT(o.id_oportunidad) AS oportunidades,
--        COUNT(a.id_actividad) AS actividades
--   FROM crm_usuario u
--   LEFT JOIN crm_lead        l ON l.id_usuario = u.id_usuario
--   LEFT JOIN crm_oportunidad o ON o.id_usuario = u.id_usuario
--   LEFT JOIN crm_actividad   a ON a.id_usuario = u.id_usuario
--  WHERE u.rol = 'EJECUTIVO'
--  GROUP BY u.nombre;

PROMPT ✓ Datos de demostración cargados correctamente.
PROMPT   Usuarios: 6  |  Empresas: 7  |  Leads: 5  |  Oportunidades: 6
PROMPT   Actividades: 5  |  Proyectos: 1  |  Metas: 5  |  Notificaciones: 4
