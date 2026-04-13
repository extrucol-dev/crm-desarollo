package com.extrucol.crm.actividad.dto.response;

import com.extrucol.crm.usuario.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.oportunidad.dto.response.OportunidadSimpleResponseDTO;

import java.time.LocalDateTime;

public record ActividadUbicacionResponseDTO(
    Long id,
    String tipo,
    String descripcion,
    String resultado,
    Boolean virtual,
    LocalDateTime fecha_actividad,
    UbicacionResponseDTO ubicacion,
    UsuarioResponseDTO usuario,
    OportunidadSimpleResponseDTO oportunidad

) {
}
