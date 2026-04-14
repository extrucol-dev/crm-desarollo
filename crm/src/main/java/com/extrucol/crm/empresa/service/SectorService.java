package com.extrucol.crm.empresa.service;

import com.extrucol.crm.empresa.dto.response.SectorResponseDTO;

import java.util.List;

public interface SectorService {

    /**
     * Lista todos los sectores disponibles
     */
    List<SectorResponseDTO> listar();

    /**
     * Busca un sector por ID
     */
    SectorResponseDTO buscarPorId(Long id);

    /**
     * Busca un sector por código
     */
    SectorResponseDTO buscarPorCodigo(String codigo);
}
