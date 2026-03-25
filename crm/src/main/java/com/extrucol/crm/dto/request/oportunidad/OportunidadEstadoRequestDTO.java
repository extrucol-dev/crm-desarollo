package com.extrucol.crm.dto.request.oportunidad;

import jakarta.validation.constraints.NotNull;

public record OportunidadEstadoRequestDTO(
        @NotNull(message = "El estado es obligatorio")
        String estado
) {
}
