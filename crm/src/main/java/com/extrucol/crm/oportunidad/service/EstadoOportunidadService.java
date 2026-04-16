package com.extrucol.crm.oportunidad.service;

import com.extrucol.crm.oportunidad.dto.request.EstadoOportunidadRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.EstadoOportunidadResponseDTO;

import java.util.List;

public interface EstadoOportunidadService {

    List<EstadoOportunidadResponseDTO> listar();

    EstadoOportunidadResponseDTO buscarPorId(Long id);

    EstadoOportunidadResponseDTO crear(EstadoOportunidadRequestDTO dto);

    void eliminar(Long id);
}
