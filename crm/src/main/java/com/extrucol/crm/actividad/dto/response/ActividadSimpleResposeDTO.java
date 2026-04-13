package com.extrucol.crm.actividad.dto.response;

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
