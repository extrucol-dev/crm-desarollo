package com.extrucol.crm.dto.response;

import com.extrucol.crm.model.Usuario;

public record ClienteResponseDTO(
        Long id,
        String nombre,
        String empresa,
        String sector,
        String ciudad,
        String telefono,
        String email
) {
}
