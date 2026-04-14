package com.extrucol.crm.empresa.dto.response;

import java.time.LocalDateTime;

public record EmpresaResponseDTO(
        Long id,
        String nombre,
        String direccion,
        String municipio_nombre,
        String departamento_nombre,
        String sector_nombre,
        String documento_tipo,
        String no_documento,
        String modalidad_tipo,
        LocalDateTime fecha_creacion
) {
}
