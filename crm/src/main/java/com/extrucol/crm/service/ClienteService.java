package com.extrucol.crm.service;

import com.extrucol.crm.dto.request.ClienteRequestDTO;

import com.extrucol.crm.dto.response.cliente.ClienteOportunidadesResponseDTO;
import com.extrucol.crm.dto.response.cliente.ClienteResponseDTO;


import java.util.List;

public interface ClienteService {
    ClienteResponseDTO crear(ClienteRequestDTO dto);

    List<ClienteResponseDTO> listar();

    List<ClienteResponseDTO> listarPorEjecutivo();

    ClienteOportunidadesResponseDTO buscarPorId(Long id);

    ClienteResponseDTO actualizar(Long id, ClienteRequestDTO dto);

    void eliminar(Long id);
}
