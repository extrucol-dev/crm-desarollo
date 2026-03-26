package com.extrucol.crm.dto.response.cliente;

import com.extrucol.crm.dto.response.oportunidad.OportunidadResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadSimpleResponseDTO;

import java.util.List;

public record ClienteOportunidadesResponseDTO(
        Long id,
        String nombre,
        String empresa,
        String sector,
        String ciudad,
        String telefono,
        String email,
        List<OportunidadSimpleResponseDTO> oportunidades
) {
}
