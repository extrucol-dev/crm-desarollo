package com.extrucol.crm.dto.request;

import com.extrucol.crm.enums.RolUsuario;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioEstadoRequestDTO(

        @Schema(description = "Estado del usuario", example = "true")
        @NotNull(message = "El campo no puede ser nulo")
        Boolean activo

) {
}
