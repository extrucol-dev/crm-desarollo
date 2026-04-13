package com.extrucol.crm.dto.response.cliente;

import com.extrucol.crm.dto.response.oportunidad.OportunidadSimpleResponseDTO;

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
