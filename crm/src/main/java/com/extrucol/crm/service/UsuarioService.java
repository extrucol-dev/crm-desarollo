package com.extrucol.crm.service;

import com.extrucol.crm.dto.request.UsuarioEstadoRequestDTO;
import com.extrucol.crm.dto.request.UsuarioRequestDTO;
import com.extrucol.crm.dto.response.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {
    UsuarioResponseDTO crear(UsuarioRequestDTO dto);

    List<UsuarioResponseDTO> listar();

    UsuarioResponseDTO buscarPorId(Long id);

    UsuarioResponseDTO actualizar(Long id, UsuarioRequestDTO dto);

    UsuarioResponseDTO actualizarEstado(Long id, UsuarioEstadoRequestDTO dto);

    void eliminar(Long id);
}
