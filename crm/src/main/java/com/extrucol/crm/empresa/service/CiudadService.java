package com.extrucol.crm.empresa.service;


import com.extrucol.crm.empresa.dto.response.CiudadResponseDTO;

import java.util.List;

public interface CiudadService {

    List<CiudadResponseDTO> listar();

    CiudadResponseDTO buscarPorId(Long id);
}
