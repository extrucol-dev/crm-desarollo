package com.extrucol.crm.dto.request;

import com.extrucol.crm.enums.RolUsuario;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record UsuarioRequestDTO(

        @Schema(description = "Nombre del usuario", example = "Juan Perez")
        @NotNull(message = "El nombre no puede ser nulo")
        @Size(min = 5, max = 100, message = "El nombre debe tener entre 5 y 100 caracteres")
        @NotBlank(message = "El nombre no puede estar vacío")
        String nombre,

        @Schema(description = "Email del usuario", example = "juanperez@ejemplo.com")
        @NotNull(message = "El email no puede ser nulo")
        String email,

        @Schema(description = "Contraseña del usuario", example = "Juan123")
        @NotNull(message = "La contraseña no puede ser nula")
        @NotBlank(message = "La contraseña no puede estar vacía")
        String password,

        @Schema(description = "Rol del usuario", example = "EJECUTIVO")
        @NotNull(message = "El rol no puede ser nulo")
        @NotBlank(message = "La contraseña no puede estar vacía")
        RolUsuario rol,

        @Schema(description = "Estado del usuario", example = "true")
        @NotNull(message = "El campo no puede ser nulo")
        Boolean activo




) {
}
