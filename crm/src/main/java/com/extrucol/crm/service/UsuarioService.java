package com.extrucol.crm.service;

import com.extrucol.crm.dto.request.UsuarioRequestDTO;
import com.extrucol.crm.dto.response.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {
    UsuarioResponseDTO crear(UsuarioRequestDTO dto);

    List<UsuarioResponseDTO> listar();

    UsuarioResponseDTO buscarPorId(Long id);

    UsuarioResponseDTO actualizar(Long id, UsuarioRequestDTO dto);

    void eliminar(Long id);
}
