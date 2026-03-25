package com.extrucol.crm.dto.response;

import java.time.LocalDateTime;

public record ProyectoResponseDTO(
        Long id,
        String nombre,
        String descripcion,
        String estado,
        OportunidadResponseDTO oportunidad,
        UsuarioResponseDTO usuario,
        LocalDateTime fecha_creacion
) {
}
