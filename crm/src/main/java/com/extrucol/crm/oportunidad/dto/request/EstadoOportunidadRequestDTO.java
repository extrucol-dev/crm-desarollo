package com.extrucol.crm.oportunidad.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EstadoOportunidadRequestDTO(
        @NotBlank(message = "El nombre del estado es obligatorio")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
        String nombre
) {
}
