package com.extrucol.crm.auditoria.dto.response;

import com.extrucol.crm.usuario.dto.response.UsuarioResponseDTO;

import java.time.LocalDateTime;

public record AuditoriaResponseDTO(
        Long id,
        UsuarioResponseDTO usuario,
        String valor_antiguo,
        String valor_nuevo,
        LocalDateTime fecha_registro
) {
}
