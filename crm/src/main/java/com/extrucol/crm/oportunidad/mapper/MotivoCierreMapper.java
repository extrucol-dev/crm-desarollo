package com.extrucol.crm.oportunidad.mapper;

import com.extrucol.crm.oportunidad.dto.request.MotivoCierreRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.MotivoCierreResponseDTO;
import com.extrucol.crm.oportunidad.model.MotivoCierre;
import org.springframework.stereotype.Component;

@Component
public class MotivoCierreMapper {

    public MotivoCierreResponseDTO entidadADTO(MotivoCierre motivoCierre) {
        if (motivoCierre == null) return null;
        return new MotivoCierreResponseDTO(
                motivoCierre.getId(),
                motivoCierre.getMotivo()
        );
    }

    public MotivoCierre DTOAEntidad(MotivoCierreRequestDTO dto) {
        MotivoCierre motivoCierre = new MotivoCierre();
        motivoCierre.setMotivo(dto.motivo());
        return motivoCierre;
    }
}
