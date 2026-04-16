package com.extrucol.crm.auditoria.service.impl;

import com.extrucol.crm.auditoria.dto.response.AuditoriaResponseDTO;
import com.extrucol.crm.auditoria.mapper.AuditoriaMapper;
import com.extrucol.crm.auditoria.repository.AuditoriaRepository;
import com.extrucol.crm.auditoria.service.AuditoriaService;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.auditoria.Auditoria;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditoriaServiceImpl implements AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final AuditoriaMapper auditoriaMapper;

    @Override
    public List<AuditoriaResponseDTO> listar() {
        return auditoriaRepository.findAllWithUsuario().stream()
                .map(auditoriaMapper::entidadADTO)
                .toList();
    }

    @Override
    public AuditoriaResponseDTO buscarPorId(Long id) {
        Auditoria auditoria = auditoriaRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Registro de auditoría no encontrado"));
        return auditoriaMapper.entidadADTO(auditoria);
    }

    @Override
    public List<AuditoriaResponseDTO> listarPorUsuario(Long usuarioId) {
        return auditoriaRepository.findByUsuarioIdOrderByFechaRegistroDesc(usuarioId).stream()
                .map(auditoriaMapper::entidadADTO)
                .toList();
    }
}
