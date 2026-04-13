package com.extrucol.crm.usuario.dto.request;

import jakarta.validation.constraints.NotNull;

public record UsuarioEstadoRequestDTO(

        @NotNull(message = "El estado es obligatorio")
        Boolean activo

) {
}
