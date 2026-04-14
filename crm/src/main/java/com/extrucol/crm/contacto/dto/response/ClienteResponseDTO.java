package com.extrucol.crm.contacto.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record ClienteResponseDTO(
        Long id,
        String nombre,
        Long empresa_id,
        String empresa_nombre,
        List<TelefonoResponseDTO> telefonos,
        List<EmailResponseDTO> emails,
        LocalDateTime fecha_creacion
) {
}
