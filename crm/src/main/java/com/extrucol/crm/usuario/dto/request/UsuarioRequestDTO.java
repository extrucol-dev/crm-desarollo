package com.extrucol.crm.usuario.dto.request;

import com.extrucol.crm.usuario.enums.RolUsuario;
import jakarta.validation.constraints.*;

public record UsuarioRequestDTO(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 5, max = 100, message = "El nombre debe tener entre 5 y 100 caracteres")
        String nombre,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no es válido")
        @Size(max = 150, message = "El email no puede superar los 150 caracteres")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, max = 100, message = "La contraseña debe tener mínimo 6 caracteres")
        String password,

        @NotNull(message = "El rol es obligatorio")
        RolUsuario rol,

        @NotNull(message = "El estado (activo) es obligatorio")
        Boolean activo
) {
}
