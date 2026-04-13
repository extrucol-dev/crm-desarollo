package com.extrucol.crm.contacto.service;

import com.extrucol.crm.contacto.dto.request.ClienteRequestDTO;

import com.extrucol.crm.contacto.dto.response.ClienteOportunidadesResponseDTO;
import com.extrucol.crm.contacto.dto.response.ClienteResponseDTO;


import java.util.List;

public interface ClienteService {
    ClienteResponseDTO crear(ClienteRequestDTO dto);

    List<ClienteResponseDTO> listar();

    List<ClienteResponseDTO> listarPorEjecutivo();

    ClienteOportunidadesResponseDTO buscarPorId(Long id);

    ClienteResponseDTO actualizar(Long id, ClienteRequestDTO dto);

    void eliminar(Long id);
}
