package com.extrucol.crm.actividad.dto.response;

import java.math.BigDecimal;

public record UbicacionResponseDTO(
        BigDecimal longitud,
        BigDecimal latitud
) {
}
