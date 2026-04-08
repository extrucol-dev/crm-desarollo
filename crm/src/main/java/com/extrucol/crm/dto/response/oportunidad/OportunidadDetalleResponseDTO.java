package com.extrucol.crm.dto.response.oportunidad;

import com.extrucol.crm.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.dto.response.actividad.ActividadResponseDTO;
import com.extrucol.crm.dto.response.cliente.ClienteResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OportunidadDetalleResponseDTO(
        Long id,
        String nombre,
        String descripcion,
        String tipo,
        String estado,
        BigDecimal valor_estimado,
        LocalDate fecha_cierre,
        String motivo_cierre,
        ClienteResponseDTO cliente,
        UsuarioResponseDTO usuario,
        List<ActividadResponseDTO> actividades


) {
}
