-- ============================================================
-- CRM EXTRUCOL - PROYECTOS SEED DATA
-- ============================================================
INSERT INTO CRM_PROYECTOS (ID, NOMBRE, DESCRIPCION, ESTADO, OPORTUNIDAD_ID, FECHA_INICIO, FECHA_FIN, ACTIVO) VALUES
(1, 'Contrato anual tuberías Bucaramanga',  'Suministro trimestral de tuberías PVC y HDPE para proyectos municipales',  'ACTIVO',    13, '2026-03-15', '2027-03-15', 1),
(2, 'Acueducto rural Medellín',              'Diseño y construcción de red de distribución para zona rural veredal',     'ACTIVO',    2,  '2026-04-01', NULL, 1),
(3, 'Sistema presurizado zona industrial', 'Instalación de sistema contra incendios en parque industrial',              'FINALIZADO', 10, '2026-02-01', '2026-04-15', 1);
COMMIT;