package com.extrucol.crm.dto.response.catalogoResponse;

import java.math.BigDecimal;

public record MontoMinimoResponsetDTO(
        Long id,
        BigDecimal monto
) {
}
