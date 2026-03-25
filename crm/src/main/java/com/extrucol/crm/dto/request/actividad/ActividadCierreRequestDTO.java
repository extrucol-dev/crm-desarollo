package com.extrucol.crm.dto.request.actividad;

import jakarta.validation.constraints.*;


import java.math.BigDecimal;

public record ActividadCierreRequestDTO(
        @NotBlank(message = "El resultado es obligatorio")
        @Size(min = 5, max = 255, message = "El resultado debe tener entre 5 y 255 caracteres")
        String resultado,

        @NotNull(message = "La latitud es obligatoria")
        @DecimalMin(value = "-90.0", message = "Latitud mínima -90")
        @DecimalMax(value = "90.0", message = "Latitud máxima 90")
        BigDecimal latitud,

        @NotNull(message = "La longitud es obligatoria")
        @DecimalMin(value = "-180.0", message = "Longitud mínima -180")
        @DecimalMax(value = "180.0", message = "Longitud máxima 180")
        BigDecimal longitud
) {
}
