package com.extrucol.crm.dto.response;

import java.math.BigDecimal;

public record UbicacionResponseDTO(
        BigDecimal longitud,
        BigDecimal latitud
) {
}
