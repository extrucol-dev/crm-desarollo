package com.extrucol.crm.service;

import com.extrucol.crm.dto.request.proyecto.ProyectoEstadoRequestDTO;
import com.extrucol.crm.dto.request.proyecto.ProyectoRequestDTO;
import com.extrucol.crm.dto.response.ProyectoResponseDTO;

import java.util.List;

public interface ProyectoService {

    ProyectoResponseDTO crear(ProyectoRequestDTO dto);

    List<ProyectoResponseDTO> listar();

    ProyectoResponseDTO buscarPorId(Long id);

    ProyectoResponseDTO actualizar(Long id, ProyectoRequestDTO dto);

    ProyectoResponseDTO actualizarEstado(Long id, ProyectoEstadoRequestDTO dto);

    void eliminar(Long id);
}
