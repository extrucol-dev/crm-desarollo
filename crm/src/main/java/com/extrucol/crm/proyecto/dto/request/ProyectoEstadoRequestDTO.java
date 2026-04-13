package com.extrucol.crm.proyecto.dto.request;

import jakarta.validation.constraints.NotNull;

public record ProyectoEstadoRequestDTO(
        @NotNull(message = "El estado es obligatorio")
        String estado
) {
}
