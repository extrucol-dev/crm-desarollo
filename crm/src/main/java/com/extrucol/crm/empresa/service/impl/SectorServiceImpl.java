package com.extrucol.crm.empresa.service.impl;

import com.extrucol.crm.empresa.dto.response.SectorResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.empresa.mapper.SectorMapper;
import com.extrucol.crm.empresa.model.catalogo.Sector;
import com.extrucol.crm.empresa.repository.SectorRepository;
import com.extrucol.crm.empresa.service.SectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class SectorServiceImpl implements SectorService {

    private final SectorRepository sectorRepository;
    private final SectorMapper sectorMapper;

    @Override
    public List<SectorResponseDTO> listar() {
        return sectorRepository.findAll().stream()
                .map(sectorMapper::entidadADTO)
                .toList();
    }

    @Override
    public SectorResponseDTO buscarPorId(Long id) {
        Sector sector = sectorRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Sector no encontrado"));
        return sectorMapper.entidadADTO(sector);
    }

    @Override
    public SectorResponseDTO buscarPorCodigo(String codigo) {
        Sector sector = sectorRepository.findByCodigo(codigo)
                .orElseThrow(() -> new BusinessRuleException("Sector no encontrado"));
        return sectorMapper.entidadADTO(sector);
    }
}
