package com.extrucol.crm.empresa.mapper;

import com.extrucol.crm.empresa.dto.response.CiudadResponseDTO;
import com.extrucol.crm.empresa.model.catalogo.Ciudad;
import org.springframework.stereotype.Component;



@Component
public class CiudadMapper {

    public CiudadResponseDTO entidadADTO(Ciudad ciudad) {
        if (ciudad == null) return null;

        return new CiudadResponseDTO(ciudad.getId(), ciudad.getNombre());
    }

//    public Ciudad DTOAEntidad(ActividadRequestDTO dto, Usuario usuario, Oportunidad oportunidad) {
//        if (dto == null) return null;
//
//        Ciudad actividad = new Actividad();
//        actividad.setNombre(dto.tipo());
//
//        return ciudad;
//    }
}
