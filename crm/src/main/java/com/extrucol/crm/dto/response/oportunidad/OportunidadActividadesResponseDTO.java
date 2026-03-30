package com.extrucol.crm.dto.response.oportunidad;

import com.extrucol.crm.dto.response.actividad.ActividadResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OportunidadActividadesResponseDTO(
        Long id,
        String nombre,
        String descripcion,
        String tipo,
        String estado,
        BigDecimal valor_estimado,
        LocalDate fecha_cierre,
        String motivo_cierre,
        List<ActividadResponseDTO> actividades
) {
}
