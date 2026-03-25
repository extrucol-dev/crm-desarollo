package com.extrucol.crm.dto.request.usuario;

import jakarta.validation.constraints.NotNull;

public record UsuarioEstadoRequestDTO(

        @NotNull(message = "El estado es obligatorio")
        Boolean activo

) {
}
