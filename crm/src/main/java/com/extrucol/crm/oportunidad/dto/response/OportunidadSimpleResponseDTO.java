package com.extrucol.crm.oportunidad.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OportunidadSimpleResponseDTO(
        Long id,
        String nombre,
        String descripcion,
        String tipo,
        String estado,
        BigDecimal valor_estimado,
        LocalDate fecha_cierre,
        String motivo_cierre
) {
}
