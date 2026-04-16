package com.extrucol.crm.oportunidad.dto.response;

import com.extrucol.crm.usuario.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.contacto.dto.response.ClienteResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OportunidadResponseDTO(
        Long id,
        String nombre,
        String descripcion,
        String tipo,
        String estado,
        BigDecimal valor_estimado,
        LocalDate fecha_cierre,
        String motivo_cierre,
        String detalle_cierre,
        ClienteResponseDTO cliente,
        UsuarioResponseDTO usuario
) {
}
