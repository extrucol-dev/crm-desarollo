package com.extrucol.crm.usuario.service;

import com.extrucol.crm.usuario.dto.request.UsuarioEstadoRequestDTO;
import com.extrucol.crm.usuario.dto.request.UsuarioRequestDTO;
import com.extrucol.crm.usuario.dto.response.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {
    UsuarioResponseDTO crear(UsuarioRequestDTO dto);

    List<UsuarioResponseDTO> listar();

    UsuarioResponseDTO buscarPorId(Long id);

    UsuarioResponseDTO actualizar(Long id, UsuarioRequestDTO dto);

    UsuarioResponseDTO actualizarEstado(Long id, UsuarioEstadoRequestDTO dto);

    void eliminar(Long id);
}
