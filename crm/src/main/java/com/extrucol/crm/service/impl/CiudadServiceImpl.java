package com.extrucol.crm.service.impl;

import com.extrucol.crm.dto.response.catalogoResponse.CiudadResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.mapper.CiudadMapper;
import com.extrucol.crm.model.catalogo.Ciudad;
import com.extrucol.crm.repository.CiudadRepository;
import com.extrucol.crm.service.CiudadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CiudadServiceImpl  implements CiudadService {
    private final CiudadRepository ciudadRepository;
    private final CiudadMapper ciudadMapper;
    @Override
    public List<CiudadResponseDTO> listar() {
        return ciudadRepository.findAll().stream().map(ciudadMapper::entidadADTO).toList();
    }

    @Override
    public CiudadResponseDTO buscarPorId(Long id) {
        Ciudad ciudad = ciudadRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Ciudad no encontrado"));
        return ciudadMapper.entidadADTO(ciudad);
    }
}

