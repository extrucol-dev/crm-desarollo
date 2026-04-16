package com.extrucol.crm.oportunidad.mapper;

import com.extrucol.crm.oportunidad.dto.request.EstadoOportunidadRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.EstadoOportunidadResponseDTO;
import com.extrucol.crm.oportunidad.model.EstadoOportunidad;
import org.springframework.stereotype.Component;

@Component
public class EstadoOportunidadMapper {

    public EstadoOportunidadResponseDTO entidadADTO(EstadoOportunidad estado) {
        if (estado == null) return null;
        return new EstadoOportunidadResponseDTO(estado.getId(), estado.getNombre());
    }

    public EstadoOportunidad DTOAEntidad(EstadoOportunidadRequestDTO dto) {
        EstadoOportunidad estado = new EstadoOportunidad();
        estado.setNombre(dto.nombre());
        return estado;
    }
}
