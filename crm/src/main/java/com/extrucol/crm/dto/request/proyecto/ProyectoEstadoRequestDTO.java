package com.extrucol.crm.dto.request.proyecto;

import jakarta.validation.constraints.NotNull;

public record ProyectoEstadoRequestDTO(
        @NotNull(message = "El estado es obligatorio")
        String estado
) {
}
