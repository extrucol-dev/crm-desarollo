package com.extrucol.crm.oportunidad.service;

import com.extrucol.crm.oportunidad.dto.request.MotivoCierreRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.MotivoCierreResponseDTO;

import java.util.List;

public interface MotivoCierreService {

    List<MotivoCierreResponseDTO> listar();

    MotivoCierreResponseDTO buscarPorId(Long id);

    MotivoCierreResponseDTO crear(MotivoCierreRequestDTO dto);

    void eliminar(Long id);
}
