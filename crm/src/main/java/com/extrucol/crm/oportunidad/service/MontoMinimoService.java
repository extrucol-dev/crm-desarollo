package com.extrucol.crm.oportunidad.service;

import com.extrucol.crm.oportunidad.dto.request.MontoMinimoRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.MontoMinimoResponsetDTO;

import java.util.List;

public interface MontoMinimoService {

    List<MontoMinimoResponsetDTO> listar();

    MontoMinimoResponsetDTO buscarPorId(Long id);

    MontoMinimoResponsetDTO crear(MontoMinimoRequestDTO dto);

    void eliminar(Long id);
}
