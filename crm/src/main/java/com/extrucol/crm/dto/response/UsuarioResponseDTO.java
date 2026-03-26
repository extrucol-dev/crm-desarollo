package com.extrucol.crm.dto.response;

import com.extrucol.crm.enums.RolUsuario;

public record UsuarioResponseDTO(
        Long id,
        String nombre,
        String email,
        RolUsuario rol,
        Boolean activo

) {
}
