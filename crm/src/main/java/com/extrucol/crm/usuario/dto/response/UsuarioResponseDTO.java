package com.extrucol.crm.usuario.dto.response;

import com.extrucol.crm.usuario.enums.RolUsuario;

public record UsuarioResponseDTO(
        Long id,
        String nombre,
        String email,
        RolUsuario rol,
        Boolean activo

) {
}
