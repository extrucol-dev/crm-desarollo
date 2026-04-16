package com.extrucol.crm.oportunidad.mapper;

import com.extrucol.crm.oportunidad.dto.request.MontoMinimoRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.MontoMinimoResponsetDTO;
import com.extrucol.crm.oportunidad.model.MontoMinimo;
import org.springframework.stereotype.Component;

@Component
public class MontoMinimoMapper {

    public MontoMinimoResponsetDTO entidadADTO(MontoMinimo montoMinimo) {
        if (montoMinimo == null) return null;
        return new MontoMinimoResponsetDTO(
                montoMinimo.getId(),
                montoMinimo.getMonto()
        );
    }

    public MontoMinimo DTOAEntidad(MontoMinimoRequestDTO dto) {
        MontoMinimo montoMinimo = new MontoMinimo();
        montoMinimo.setMonto(dto.monto());
        return montoMinimo;
    }
}
