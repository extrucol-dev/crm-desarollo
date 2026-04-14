package com.extrucol.crm.contacto.dto.response;

import com.extrucol.crm.oportunidad.dto.response.OportunidadSimpleResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

public record ClienteOportunidadesResponseDTO(
        Long id,
        String nombre,
        String empresa_nombre,
        String telefonos,
        String emails,
        LocalDateTime fecha_creacion,
        List<OportunidadSimpleResponseDTO> oportunidades
) {
}
