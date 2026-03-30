package com.extrucol.crm.dto.response.actividad;

import java.time.LocalDateTime;

public record ActividadSimpleResposeDTO(
        Long id,
        String tipo,
        String descripcion,
        String resultado,
        Boolean virtual,
        LocalDateTime fecha_actividad
) {
}
