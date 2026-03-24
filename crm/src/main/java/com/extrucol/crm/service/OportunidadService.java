package com.extrucol.crm.service;

import com.extrucol.crm.dto.request.OportunidadEstadoRequestDTO;
import com.extrucol.crm.dto.request.OportunidadRequestDTO;
import com.extrucol.crm.dto.response.OportunidadResponseDTO;

import java.util.List;

public interface OportunidadService {
        OportunidadResponseDTO crear(OportunidadRequestDTO dto);

        List<OportunidadResponseDTO> listar();

        OportunidadResponseDTO buscarPorId(Long id);

        OportunidadResponseDTO actualizar(Long id, OportunidadRequestDTO dto);

        OportunidadResponseDTO actualizarEstado(Long id, OportunidadEstadoRequestDTO dto);

        void eliminar(Long id);

}
