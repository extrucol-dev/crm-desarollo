package com.extrucol.crm.dto.response;

import com.extrucol.crm.enums.RolUsuario;

public record UsuarioResponseDTO(
        Long id,
        String nombre,
        String email,
        String password,
        RolUsuario rol,
        Boolean activo

) {
}
