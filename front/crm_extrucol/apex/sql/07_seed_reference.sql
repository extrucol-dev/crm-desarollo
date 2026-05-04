-- =============================================================================
-- CRM EXTRUCOL — SEED DATA: Catálogos de referencia
-- Ejecutar DESPUÉS de 04_ddl_catalogs.sql y 05_ddl_core.sql
-- Oracle APEX SQL Workshop: inserts individuales, sin comentarios en VALUES.
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CRM_PAIS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_pais (id_pais, nombre, codigo) VALUES (170, 'Colombia', 'CO');
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. CRM_DEPARTAMENTO  (33 departamentos de Colombia)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (101, 'Antioquia', '05', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (102, 'Atlántico', '08', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (103, 'Bogotá D.C.', '11', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (104, 'Bolívar', '13', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (105, 'Boyacá', '15', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (106, 'Caldas', '17', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (107, 'Cauca', '19', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (108, 'Cesar', '20', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (109, 'Córdoba', '23', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (110, 'Cundinamarca', '25', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (111, 'Chocó', '27', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (112, 'Huila', '41', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (113, 'La Guajira', '44', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (114, 'Magdalena', '47', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (115, 'Meta', '50', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (116, 'Nariño', '52', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (117, 'Norte de Santander', '54', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (118, 'Quindío', '63', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (119, 'Risaralda', '66', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (120, 'Santander', '68', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (121, 'Sucre', '70', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (122, 'Tolima', '73', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (123, 'Valle del Cauca', '76', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (124, 'Arauca', '81', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (125, 'Casanare', '85', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (126, 'Putumayo', '86', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (127, 'San Andrés y Providencia', '88', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (128, 'Amazonas', '91', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (129, 'Guainía', '94', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (130, 'Guaviare', '95', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (131, 'Vaupés', '97', 170);
INSERT INTO crm_departamento (id_departamento, nombre, codigo, id_pais) VALUES (132, 'Vichada', '99', 170);
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. CRM_MUNICIPIO  (ciudades principales)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10001, 'Medellín', '05001', 101);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10002, 'Bello', '05088', 101);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10003, 'Itagüí', '05172', 101);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10004, 'Envigado', '05266', 101);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10005, 'Rionegro', '05615', 101);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10006, 'Barranquilla', '08001', 102);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10007, 'Soledad', '08638', 102);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10008, 'Malambo', '08421', 102);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10009, 'Bogotá D.C.', '11001', 103);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10010, 'Cartagena', '13001', 104);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10011, 'Barranquitas', '13052', 104);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10012, 'Magangué', '13430', 104);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10013, 'Tunja', '15001', 105);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10014, 'Sogamoso', '15442', 105);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10015, 'Duitama', '15238', 105);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10016, 'Chiquinquirá', '15185', 105);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10017, 'Manizales', '17001', 106);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10018, 'La Dorada', '17388', 106);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10019, 'Popayán', '19001', 107);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10020, 'Valledupar', '20001', 108);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10021, 'Astrea', '20175', 108);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10022, 'Montería', '23001', 109);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10023, 'Lorica', '23464', 109);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10024, 'Zipaquirá', '25899', 110);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10025, 'Facatativá', '25269', 110);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10026, 'Girardot', '25377', 110);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10027, 'Fusagasugá', '25295', 110);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10028, 'Chía', '25175', 110);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10029, 'Cajicá', '25154', 110);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10030, 'Mosquera', '25473', 110);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10031, 'Soacha', '25754', 110);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10032, 'Neiva', '41001', 112);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10033, 'Pitalito', '41551', 112);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10034, 'Riohacha', '44001', 113);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10035, 'Maicao', '44347', 113);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10036, 'Santa Marta', '47001', 114);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10037, 'Ciénaga', '47189', 114);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10038, 'Villavicencio', '50001', 115);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10039, 'Meta', '50577', 115);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10040, 'Pasto', '52001', 116);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10041, 'Ipiales', '52356', 116);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10042, 'Cúcuta', '54001', 117);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10043, 'Ocaña', '54498', 117);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10044, 'Pamplona', '54518', 117);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10045, 'Armenia', '63001', 118);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10046, 'Calarcá', '63130', 118);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10047, 'Pereira', '66001', 119);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10048, 'Dosquebradas', '66170', 119);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10049, 'Santa Rosa de Cabal', '63792', 119);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10050, 'Bucaramanga', '68001', 120);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10051, 'Floridablanca', '68276', 120);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10052, 'Girón', '68307', 120);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10053, 'Barrancabermeja', '68092', 120);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10054, 'San Gil', '68815', 120);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10055, 'Sincelejo', '70001', 121);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10056, 'Ibagué', '73001', 122);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10057, 'Espinal', '73268', 122);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10058, 'Melgar', '73349', 122);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10059, 'Cali', '76001', 123);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10060, 'Palmira', '76520', 123);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10061, 'Buenaventura', '76109', 123);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10062, 'Tuluá', '76834', 123);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10063, 'Cartago', '76130', 123);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10064, 'Yopal', '85001', 125);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10065, 'Florencia', '18001', 107);
INSERT INTO crm_municipio (id_municipio, nombre, codigo, id_departamento) VALUES (10066, 'Mocoa', '86001', 126);
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. CRM_DOCUMENTO
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_documento (id_documento, tipo, codigo) VALUES (101, 'NIT', 'NIT');
INSERT INTO crm_documento (id_documento, tipo, codigo) VALUES (102, 'Cédula', 'CC');
INSERT INTO crm_documento (id_documento, tipo, codigo) VALUES (103, 'Extranjería', 'CE');
INSERT INTO crm_documento (id_documento, tipo, codigo) VALUES (104, 'Pasaporte', 'PP');
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. CRM_MODALIDAD
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_modalidad (id_modalidad, nombre) VALUES (101, 'Interior');
INSERT INTO crm_modalidad (id_modalidad, nombre) VALUES (102, 'Exterior');
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. CRM_SECTOR
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_sector (id_sector, nombre, descripcion, color_hex) VALUES (101, 'Agua Potable', 'Redes de acueducto y potabilización', '#24388C');
INSERT INTO crm_sector (id_sector, nombre, descripcion, color_hex) VALUES (102, 'Gas Natural', 'Redes de distribución de gas combustible', '#1A8754');
INSERT INTO crm_sector (id_sector, nombre, descripcion, color_hex) VALUES (103, 'Agro/Riego', 'Sistemas de riego agrícola y drenaje', '#2ECC71');
INSERT INTO crm_sector (id_sector, nombre, descripcion, color_hex) VALUES (104, 'Industrial', 'Proyectos industriales y de manufactura', '#7F8C8D');
INSERT INTO crm_sector (id_sector, nombre, descripcion, color_hex) VALUES (105, 'Saneamiento', 'Alcantarillado y tratamiento de aguas residuales', '#8E44AD');
INSERT INTO crm_sector (id_sector, nombre, descripcion, color_hex) VALUES (106, 'Infraestructura', 'Obras civiles y infraestructura', '#F39C12');
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. CRM_ORIGEN_LEAD
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_origen_lead (id_origen_lead, nombre, color_hex, descripcion, activo) VALUES (101, 'WhatsApp', '#25D366', 'Mensajería instantánea', 1);
INSERT INTO crm_origen_lead (id_origen_lead, nombre, color_hex, descripcion, activo) VALUES (102, 'Instagram', '#E4405F', 'Red social Instagram', 1);
INSERT INTO crm_origen_lead (id_origen_lead, nombre, color_hex, descripcion, activo) VALUES (103, 'Facebook', '#1877F2', 'Red social Facebook', 1);
INSERT INTO crm_origen_lead (id_origen_lead, nombre, color_hex, descripcion, activo) VALUES (104, 'Web', '#24388C', 'Formulario del sitio web', 1);
INSERT INTO crm_origen_lead (id_origen_lead, nombre, color_hex, descripcion, activo) VALUES (105, 'Referido', '#F39610', 'Recomendación de cliente existente', 1);
INSERT INTO crm_origen_lead (id_origen_lead, nombre, color_hex, descripcion, activo) VALUES (106, 'Feria', '#9B59B6', 'Evento o feria comercial', 1);
INSERT INTO crm_origen_lead (id_origen_lead, nombre, color_hex, descripcion, activo) VALUES (107, 'Llamada', '#E67E22', 'Contacto telefónico', 1);
INSERT INTO crm_origen_lead (id_origen_lead, nombre, color_hex, descripcion, activo) VALUES (108, 'Email', '#3498DB', 'Correo electrónico', 1);
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. CRM_ESTADO_LEAD
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_estado_lead (id_estado_lead, nombre, tipo, orden, color_hex) VALUES (101, 'Nuevo', 'ABIERTO', 1, '#3498DB');
INSERT INTO crm_estado_lead (id_estado_lead, nombre, tipo, orden, color_hex) VALUES (102, 'Contactado', 'ABIERTO', 2, '#9B59B6');
INSERT INTO crm_estado_lead (id_estado_lead, nombre, tipo, orden, color_hex) VALUES (103, 'Interesado', 'CALIFICADO', 3, '#27AE60');
INSERT INTO crm_estado_lead (id_estado_lead, nombre, tipo, orden, color_hex) VALUES (104, 'No Interesado', 'DESCALIFICADO', 4, '#E74C3C');
INSERT INTO crm_estado_lead (id_estado_lead, nombre, tipo, orden, color_hex) VALUES (105, 'Conversión OK', 'CALIFICADO', 5, '#1A8754');
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 9. CRM_INTERES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_interes (id_interes, nombre, descripcion, activo) VALUES (101, 'Tubería PE100', 'Tubos de polietileno de alta densidad PE100', 1);
INSERT INTO crm_interes (id_interes, nombre, descripcion, activo) VALUES (102, 'Accesorios PE', 'Codos, tee, reducciones, bridas en PE', 1);
INSERT INTO crm_interes (id_interes, nombre, descripcion, activo) VALUES (103, 'Riego', 'Sistemas de riego por goteo y aspersión', 1);
INSERT INTO crm_interes (id_interes, nombre, descripcion, activo) VALUES (104, 'Válvulas', 'Válvulas de corte, retención y control', 1);
INSERT INTO crm_interes (id_interes, nombre, descripcion, activo) VALUES (105, 'Electroválvulas', 'Válvulas solenoid para automatización', 1);
INSERT INTO crm_interes (id_interes, nombre, descripcion, activo) VALUES (106, 'Medición', 'Medidores de caudal y presión', 1);
INSERT INTO crm_interes (id_interes, nombre, descripcion, activo) VALUES (107, 'Instalaciones', 'Servicio de instalación y puesta en marcha', 1);
INSERT INTO crm_interes (id_interes, nombre, descripcion, activo) VALUES (108, 'Consulta Técnica', 'Asesoría técnica sin compromiso de compra', 1);
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 10. CRM_MOTIVO_DESCALIFICACION
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_motivo_descalificacion (id_motivo_descalificacion, nombre, descripcion, activo) VALUES (101, 'No responde', 'No responde contactos sucesivos', 1);
INSERT INTO crm_motivo_descalificacion (id_motivo_descalificacion, nombre, descripcion, activo) VALUES (102, 'Presupuesto insuficiente', 'Cliente sin recursos para el proyecto', 1);
INSERT INTO crm_motivo_descalificacion (id_motivo_descalificacion, nombre, descripcion, activo) VALUES (103, 'No es responsable', 'No tiene poder de decisión ni lo identifica', 1);
INSERT INTO crm_motivo_descalificacion (id_motivo_descalificacion, nombre, descripcion, activo) VALUES (104, 'Trasladado a distribuidor', 'Se derivó a distribuidor de la zona', 1);
INSERT INTO crm_motivo_descalificacion (id_motivo_descalificacion, nombre, descripcion, activo) VALUES (105, 'Proyecto congelado', 'El proyecto está en pausa indefinida', 1);
INSERT INTO crm_motivo_descalificacion (id_motivo_descalificacion, nombre, descripcion, activo) VALUES (106, 'Fuera del mercado', 'No aplica para soluciones de Extrucol', 1);
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 11. CRM_TIPO_OPORTUNIDAD
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_tipo_oportunidad (id_tipo_oportunidad, nombre, descripcion) VALUES (101, 'Licitación pública', 'Convocatoria pública de compras del gobierno');
INSERT INTO crm_tipo_oportunidad (id_tipo_oportunidad, nombre, descripcion) VALUES (102, 'Suministro directo', 'Compra directa de materiales sin concurso');
INSERT INTO crm_tipo_oportunidad (id_tipo_oportunidad, nombre, descripcion) VALUES (103, 'Proyecto a medida', 'Proyecto con diseño e ingeniería personalizada');
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 12. CRM_ESTADO_OPORTUNIDAD
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_estado_oportunidad (id_estado, nombre, tipo, orden, color_hex) VALUES (101, 'Prospección', 'ABIERTO', 1, '#3498DB');
INSERT INTO crm_estado_oportunidad (id_estado, nombre, tipo, orden, color_hex) VALUES (102, 'Calificación', 'ABIERTO', 2, '#9B59B6');
INSERT INTO crm_estado_oportunidad (id_estado, nombre, tipo, orden, color_hex) VALUES (103, 'Especificación', 'ABIERTO', 3, '#F39C12');
INSERT INTO crm_estado_oportunidad (id_estado, nombre, tipo, orden, color_hex) VALUES (104, 'Negociación', 'ABIERTO', 4, '#E67E22');
INSERT INTO crm_estado_oportunidad (id_estado, nombre, tipo, orden, color_hex) VALUES (105, 'Ganada', 'GANADO', 5, '#27AE60');
INSERT INTO crm_estado_oportunidad (id_estado, nombre, tipo, orden, color_hex) VALUES (106, 'Perdida', 'PERDIDO', 6, '#E74C3C');
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 13. CRM_MOTIVO_CIERRE
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_motivo_cierre (id_motivo_cierre, nombre, tipo, descripcion) VALUES (101, 'Proyecto adjudicado', 'GANADO', 'Se ganó la Licitación o pedido directo');
INSERT INTO crm_motivo_cierre (id_motivo_cierre, nombre, tipo, descripcion) VALUES (102, 'Precio acordado', 'GANADO', 'Cliente acepta nuestra cotización');
INSERT INTO crm_motivo_cierre (id_motivo_cierre, nombre, tipo, descripcion) VALUES (103, 'Cliente nuevo cerrado', 'GANADO', 'Primera venta al cliente');
INSERT INTO crm_motivo_cierre (id_motivo_cierre, nombre, tipo, descripcion) VALUES (104, 'Competencia ganó', 'PERDIDO', 'Otro proveedor ofreció mejor precio o plazo');
INSERT INTO crm_motivo_cierre (id_motivo_cierre, nombre, tipo, descripcion) VALUES (105, 'Presupuesto recortado', 'PERDIDO', 'Cliente redujo presupuesto o canceló proyecto');
INSERT INTO crm_motivo_cierre (id_motivo_cierre, nombre, tipo, descripcion) VALUES (106, 'No se alcanzó a entregar', 'PERDIDO', 'Deadline no cumplible por plazos de entrega');
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 14. CRM_PRODUCTO
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_producto (id_producto, nombre, descripcion, tipo, activo) VALUES (101, 'Tubo PE100 RD11 1"', 'Tubo conduit PE100 RD11 diámetro 1 pulgada longitud 6m', 'TUBERÍA', 1);
INSERT INTO crm_producto (id_producto, nombre, descripcion, tipo, activo) VALUES (102, 'Tubo PE100 RD11 2"', 'Tubo conduit PE100 RD11 diámetro 2 pulgadas longitud 6m', 'TUBERÍA', 1);
INSERT INTO crm_producto (id_producto, nombre, descripcion, tipo, activo) VALUES (103, 'Tubo PE100 RD13.5 1"', 'Tubo conduit PE100 RD13.5 diámetro 1 pulgada longitud 6m', 'TUBERÍA', 1);
INSERT INTO crm_producto (id_producto, nombre, descripcion, tipo, activo) VALUES (104, 'Codo 90° PE100 1"', 'Codo 90° horizontal flujo fittings HF 1 pulgada', 'ACCESORIO', 1);
INSERT INTO crm_producto (id_producto, nombre, descripcion, tipo, activo) VALUES (105, 'Tee 1" PE100', 'Tee reducida conexión 1 pulgada', 'ACCESORIO', 1);
INSERT INTO crm_producto (id_producto, nombre, descripcion, tipo, activo) VALUES (106, 'Válvula bola 1" manual', 'Válvula de bola paso total 1 pulgada manual', 'VÁLVULA', 1);
INSERT INTO crm_producto (id_producto, nombre, descripcion, tipo, activo) VALUES (107, 'Electroválvula 1" NC 24V', 'Válvula solenoides 1 pulgada normally closed 24V', 'ELECTROVÁLVULA', 1);
INSERT INTO crm_producto (id_producto, nombre, descripcion, tipo, activo) VALUES (108, 'Medidor flujo 1" Woltman', 'Medidor de caudal tipo Woltman 1 pulgada', 'MEDICIÓN', 1);
COMMIT;


-- ─────────────────────────────────────────────────────────────────────────────
-- 15. CRM_CONFIGURACION_SISTEMA
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO crm_configuracion_sistema (id_configuracion, clave, valor, unidad, descripcion) VALUES (101, 'dias_alerta_lead_sin_contactar', '3', 'días', 'Días sin contactar lead antes de alertar');
INSERT INTO crm_configuracion_sistema (id_configuracion, clave, valor, unidad, descripcion) VALUES (102, 'dias_alerta_opp_estancada', '7', 'días', 'Días sin actividad en opp antes de alertar');
INSERT INTO crm_configuracion_sistema (id_configuracion, clave, valor, unidad, descripcion) VALUES (103, 'monto_minimo_oportunidad', '1000000', 'COP', 'Monto mínimo para registrar oportunidad');
INSERT INTO crm_configuracion_sistema (id_configuracion, clave, valor, unidad, descripcion) VALUES (104, 'max_leads_sin_contactar', '10', 'cantidad', 'Máximo leads sin contactar antes de alerta crítica');
INSERT INTO crm_configuracion_sistema (id_configuracion, clave, valor, unidad, descripcion) VALUES (105, 'porcentaje_alerta_meta', '80', 'porcentaje', 'Porcentaje de meta que activa advertencia');
INSERT INTO crm_configuracion_sistema (id_configuracion, clave, valor, unidad, descripcion) VALUES (106, 'color_critica', '#C0392B', NULL, 'Color hex para notificaciones críticas');
INSERT INTO crm_configuracion_sistema (id_configuracion, clave, valor, unidad, descripcion) VALUES (107, 'color_advertencia', '#F39C12', NULL, 'Color hex para advertencias');
INSERT INTO crm_configuracion_sistema (id_configuracion, clave, valor, unidad, descripcion) VALUES (108, 'color_exito', '#27AE60', NULL, 'Color hex para éxito');
COMMIT;