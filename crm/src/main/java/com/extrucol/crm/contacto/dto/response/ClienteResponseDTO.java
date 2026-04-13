package com.extrucol.crm.contacto.dto.response;

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
