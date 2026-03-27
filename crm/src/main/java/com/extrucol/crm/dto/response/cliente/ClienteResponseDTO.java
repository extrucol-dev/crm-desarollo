package com.extrucol.crm.dto.response.cliente;

import com.extrucol.crm.dto.response.CiudadResponseDTO;
import com.extrucol.crm.model.Ciudad;

import java.time.LocalDateTime;

public record ClienteResponseDTO(
        Long id,
        String nombre,
        String empresa,
        String sector,
        CiudadResponseDTO ciudad,
        String telefono,
        String email,
        LocalDateTime fecha_creacion
) {
}
