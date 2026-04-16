package com.extrucol.crm.oportunidad.dto.request;

import jakarta.validation.constraints.NotNull;

public record OportunidadEstadoRequestDTO(
        @NotNull(message = "El estado es obligatorio")
        Long estado_id
) {
}
