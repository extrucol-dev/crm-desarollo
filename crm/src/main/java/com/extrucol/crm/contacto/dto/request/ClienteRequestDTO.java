package com.extrucol.crm.contacto.dto.request;

import jakarta.validation.constraints.*;

import java.util.List;

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

        List<TelefonoRequestDTO> telefonos,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no es válido")
        Long email


) {
}
