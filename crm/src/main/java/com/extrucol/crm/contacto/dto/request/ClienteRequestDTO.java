package com.extrucol.crm.contacto.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public record ClienteRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
        String nombre,

        @NotNull(message = "La empresa es obligatoria")
        Long empresa_id,

        @NotEmpty(message = "Debe incluir al menos un teléfono")
        @Valid
        List<TelefonoRequestDTO> telefonos,

        @NotEmpty(message = "Debe incluir al menos un email")
        @Valid
        List<EmailRequestDTO> emails
) {
}
