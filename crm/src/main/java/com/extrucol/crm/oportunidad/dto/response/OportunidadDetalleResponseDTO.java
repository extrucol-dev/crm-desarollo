package com.extrucol.crm.oportunidad.dto.response;

import com.extrucol.crm.usuario.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.actividad.dto.response.ActividadResponseDTO;
import com.extrucol.crm.contacto.dto.response.ClienteResponseDTO;

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
