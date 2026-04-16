package com.extrucol.crm.oportunidad.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record OportunidadCierreRequestDTO(

        @FutureOrPresent(message = "La fecha de cierre no puede ser pasada")
        LocalDate fecha_cierre,

        @NotNull(message = "El motivo de cierre es obligatorio")
        Long motivo_cierre_id,

        @Size(max = 1000, message = "El detalle no puede exceder 1000 caracteres")
        String detalle_cierre,

        @NotNull(message = "El estado es obligatorio")
        Long estado_id

) {
}
