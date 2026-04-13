package com.extrucol.crm.contacto.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record ClienteResponseDTO(
        Long id,
        String nombre,
        String empresa,
        String sector,
        List<TelefonoResponseDTO> telefonos,
        List<EmailResponseDTO> emails,
        LocalDateTime fecha_creacion
) {
}
