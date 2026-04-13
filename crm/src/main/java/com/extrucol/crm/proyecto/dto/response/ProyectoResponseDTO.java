package com.extrucol.crm.proyecto.dto.response;

import com.extrucol.crm.oportunidad.dto.response.OportunidadResponseDTO;
import com.extrucol.crm.usuario.dto.response.UsuarioResponseDTO;

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
