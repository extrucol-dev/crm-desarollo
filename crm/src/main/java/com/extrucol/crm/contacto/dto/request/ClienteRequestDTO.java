package com.extrucol.crm.contacto.dto.request;

import jakarta.validation.constraints.*;

public record ClienteRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 3, max = 100)
        String nombre,

        @NotBlank(message = "La empresa es obligatoria")
        @Size(max = 100)
        String empresa,

        @NotBlank(message = "El sector es obligatorio")
        @Size(max = 100)
        String sector,

        @NotNull(message = "La ciudad es obligatoria")
        Long ciudad,

        @NotBlank(message = "El teléfono es obligatorio")
        @Pattern(regexp = "^[0-9]{7,15}$", message = "El teléfono debe contener solo números (7-15 dígitos)")
        String telefono,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no es válido")
        String email


) {
}
