package com.extrucol.crm.dto.request.oportunidad;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record OportunidadCierreRequestDTO(
        @FutureOrPresent(message = "La fecha de cierre no puede ser pasada")
        LocalDate fecha_cierre,

        @Size(min = 10, max = 500, message = "El motivo de cierre no puede exceder 500 caracteres")
        String motivo_cierre,

        @NotBlank(message = "El estado es obligatorio")
        String estado
) {
}
