package com.extrucol.crm.contacto.dto.response;

import com.extrucol.crm.oportunidad.dto.response.OportunidadSimpleResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

public record ClienteOportunidadesResponseDTO(
        Long id,
        String nombre,
        String empresa,
        String sector,
        String telefono,
        String email,
        LocalDateTime fecha_creacion,
        List<OportunidadSimpleResponseDTO> oportunidades
) {
}
