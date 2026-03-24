package com.extrucol.crm.dto.response;

import com.extrucol.crm.model.Cliente;
import com.extrucol.crm.model.Usuario;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OportunidadResponseDTO(

        String nombre,

        String descripcion,

        String tipo,

        String estado,

        BigDecimal valor_estimado,

        LocalDate fecha_cierre,

        String motivo_cierre,

        Cliente cliente,

        Usuario usuario
) {
}
