package com.extrucol.crm.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OportunidadRequestDTO(

        String nombre,

        String descripcion,

        String tipo,

        String estado,

        BigDecimal valor_estimado,

        LocalDate fecha_cierre,

        String motivo_cierre,

        Long cliente,

        Long usuario
) {
}
