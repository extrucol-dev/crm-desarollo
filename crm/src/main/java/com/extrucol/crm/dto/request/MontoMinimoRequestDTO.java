package com.extrucol.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record MontoMinimoRequestDTO(
        @NotBlank(message = "El monto no puede ser vacio")
        @PositiveOrZero(message = "El monto no puede ser negativo")
        BigDecimal monto
) {
}
