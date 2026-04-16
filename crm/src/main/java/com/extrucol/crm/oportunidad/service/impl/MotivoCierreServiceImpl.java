package com.extrucol.crm.oportunidad.service.impl;

import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.oportunidad.dto.request.MotivoCierreRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.MotivoCierreResponseDTO;
import com.extrucol.crm.oportunidad.mapper.MotivoCierreMapper;
import com.extrucol.crm.oportunidad.model.MotivoCierre;
import com.extrucol.crm.oportunidad.repository.MotivoCierreRepository;
import com.extrucol.crm.oportunidad.service.MotivoCierreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MotivoCierreServiceImpl implements MotivoCierreService {

    private final MotivoCierreRepository motivoCierreRepository;
    private final MotivoCierreMapper motivoCierreMapper;

    @Override
    public List<MotivoCierreResponseDTO> listar() {
        return motivoCierreRepository.findAll().stream()
                .map(motivoCierreMapper::entidadADTO)
                .toList();
    }

    @Override
    public MotivoCierreResponseDTO buscarPorId(Long id) {
        MotivoCierre motivoCierre = motivoCierreRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Motivo de cierre no encontrado"));
        return motivoCierreMapper.entidadADTO(motivoCierre);
    }

    @Override
    @Transactional
    public MotivoCierreResponseDTO crear(MotivoCierreRequestDTO dto) {
        MotivoCierre motivoCierre = motivoCierreMapper.DTOAEntidad(dto);
        return motivoCierreMapper.entidadADTO(motivoCierreRepository.save(motivoCierre));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        MotivoCierre motivoCierre = motivoCierreRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Motivo de cierre no encontrado"));
        motivoCierreRepository.delete(motivoCierre);
    }
}
