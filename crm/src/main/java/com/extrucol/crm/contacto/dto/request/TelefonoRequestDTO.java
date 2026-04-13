package com.extrucol.crm.contacto.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record TelefonoRequestDTO(
        @NotBlank(message = "El teléfono es obligatorio")
        @Pattern(regexp = "^[0-9]{7,15}$", message = "El teléfono debe contener solo números (7-15 dígitos)")
        String telefono
) {
}
