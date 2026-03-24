package com.extrucol.crm.service;

import com.extrucol.crm.dto.request.ClienteRequestDTO;

import com.extrucol.crm.dto.response.ClienteResponseDTO;


import java.util.List;

public interface ClienteService {
    ClienteResponseDTO crear(ClienteRequestDTO dto);

    List<ClienteResponseDTO> listar();

    ClienteResponseDTO buscarPorId(Long id);

    ClienteResponseDTO actualizar(Long id, ClienteRequestDTO dto);


    void eliminar(Long id);
}
