package com.extrucol.crm.dto.response.cliente;

import java.time.LocalDateTime;

public record ClienteResponseDTO(
        Long id,
        String nombre,
        String empresa,
        String sector,
        String telefono,
        String email,
        LocalDateTime fecha_creacion
) {
}
