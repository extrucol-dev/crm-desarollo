package com.extrucol.crm.oportunidad.service.impl;

import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.oportunidad.dto.request.MontoMinimoRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.MontoMinimoResponsetDTO;
import com.extrucol.crm.oportunidad.mapper.MontoMinimoMapper;
import com.extrucol.crm.oportunidad.model.MontoMinimo;
import com.extrucol.crm.oportunidad.repository.MontoMinimoRepository;
import com.extrucol.crm.oportunidad.service.MontoMinimoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MontoMinimoServiceImpl implements MontoMinimoService {

    private final MontoMinimoRepository montoMinimoRepository;
    private final MontoMinimoMapper montoMinimoMapper;

    @Override
    public List<MontoMinimoResponsetDTO> listar() {
        return montoMinimoRepository.findAll().stream()
                .map(montoMinimoMapper::entidadADTO)
                .toList();
    }

    @Override
    public MontoMinimoResponsetDTO buscarPorId(Long id) {
        MontoMinimo montoMinimo = montoMinimoRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Monto mínimo no encontrado"));
        return montoMinimoMapper.entidadADTO(montoMinimo);
    }

    @Override
    @Transactional
    public MontoMinimoResponsetDTO crear(MontoMinimoRequestDTO dto) {
        MontoMinimo montoMinimo = montoMinimoMapper.DTOAEntidad(dto);
        return montoMinimoMapper.entidadADTO(montoMinimoRepository.save(montoMinimo));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        MontoMinimo montoMinimo = montoMinimoRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Monto mínimo no encontrado"));
        montoMinimoRepository.delete(montoMinimo);
    }
}
