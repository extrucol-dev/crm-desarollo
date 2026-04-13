package com.extrucol.crm.proyecto.service;

import com.extrucol.crm.proyecto.dto.request.ProyectoEstadoRequestDTO;
import com.extrucol.crm.proyecto.dto.request.ProyectoRequestDTO;
import com.extrucol.crm.proyecto.dto.response.ProyectoResponseDTO;

import java.util.List;

public interface ProyectoService {

    ProyectoResponseDTO crear(ProyectoRequestDTO dto);
    List<ProyectoResponseDTO> listarPorUsuarioActual();
    List<ProyectoResponseDTO> listarTodos();

    ProyectoResponseDTO buscarPorId(Long id);

    ProyectoResponseDTO actualizar(Long id, ProyectoRequestDTO dto);

    ProyectoResponseDTO actualizarEstado(Long id, ProyectoEstadoRequestDTO dto);

    void eliminar(Long id);
}
