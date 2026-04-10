package com.extrucol.crm.service;


import com.extrucol.crm.dto.response.CiudadResponseDTO;

import java.util.List;

public interface CiudadService {

    List<CiudadResponseDTO> listar();

    CiudadResponseDTO buscarPorId(Long id);
}
