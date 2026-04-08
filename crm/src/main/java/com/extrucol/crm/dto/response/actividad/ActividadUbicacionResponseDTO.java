package com.extrucol.crm.dto.response.actividad;

import com.extrucol.crm.dto.response.UbicacionResponseDTO;
import com.extrucol.crm.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadSimpleResponseDTO;

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
