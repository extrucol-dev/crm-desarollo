package com.extrucol.crm.oportunidad.dto.response;

import java.math.BigDecimal;

public record MontoMinimoResponsetDTO(
        Long id,
        BigDecimal monto
) {
}
