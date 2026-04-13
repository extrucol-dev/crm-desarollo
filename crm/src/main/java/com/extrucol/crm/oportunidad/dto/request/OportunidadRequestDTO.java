package com.extrucol.crm.oportunidad.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OportunidadRequestDTO(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 150)
        String nombre,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 500)
        String descripcion,

        @NotBlank(message = "El tipo es obligatorio")
        String tipo,

        @NotBlank(message = "El estado es obligatorio")
        String estado,

        @NotNull(message = "El valor estimado es obligatorio")
        @Positive(message = "El valor estimado debe ser positivo")
        BigDecimal valor_estimado,

        @FutureOrPresent(message = "La fecha de cierre no puede ser pasada")
        LocalDate fecha_cierre,


        @NotNull(message = "El cliente es obligatorio")
        Long cliente

) {
}
