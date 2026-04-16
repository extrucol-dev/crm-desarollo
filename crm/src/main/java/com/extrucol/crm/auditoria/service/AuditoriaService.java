package com.extrucol.crm.auditoria.service;

import com.extrucol.crm.auditoria.dto.response.AuditoriaResponseDTO;

import java.util.List;

public interface AuditoriaService {

    List<AuditoriaResponseDTO> listar();

    AuditoriaResponseDTO buscarPorId(Long id);

    List<AuditoriaResponseDTO> listarPorUsuario(Long usuarioId);
}
