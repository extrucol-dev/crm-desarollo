package com.extrucol.crm.oportunidad.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MotivoCierreRequestDTO(
        @NotBlank(message = "El motivo es obligatorio")
        @Size(max = 255, message = "El motivo no puede exceder 255 caracteres")
        String motivo
) {
}
