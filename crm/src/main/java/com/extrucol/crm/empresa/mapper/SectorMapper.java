package com.extrucol.crm.empresa.mapper;

import com.extrucol.crm.empresa.dto.response.SectorResponseDTO;
import com.extrucol.crm.empresa.model.catalogo.Sector;
import org.springframework.stereotype.Component;

@Component
public class SectorMapper {

    /**
     * Convierte entidad Sector a SectorResponseDTO
     */
    public SectorResponseDTO entidadADTO(Sector sector) {
        if (sector == null) return null;

        return new SectorResponseDTO(
                sector.getId(),
                sector.getNombre(),
                sector.getCodigo()
        );
    }
}