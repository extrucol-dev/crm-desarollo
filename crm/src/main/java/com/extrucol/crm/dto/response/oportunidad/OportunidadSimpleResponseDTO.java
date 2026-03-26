package com.extrucol.crm.dto.response.oportunidad;

import com.extrucol.crm.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.dto.response.cliente.ClienteResponseDTO;

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
