package com.extrucol.crm.oportunidad.service.impl;

import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.oportunidad.dto.request.EstadoOportunidadRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.EstadoOportunidadResponseDTO;
import com.extrucol.crm.oportunidad.mapper.EstadoOportunidadMapper;
import com.extrucol.crm.oportunidad.model.EstadoOportunidad;
import com.extrucol.crm.oportunidad.repository.EstadoOportunidadRepository;
import com.extrucol.crm.oportunidad.service.EstadoOportunidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EstadoOportunidadServiceImpl implements EstadoOportunidadService {

    private final EstadoOportunidadRepository estadoRepository;
    private final EstadoOportunidadMapper estadoMapper;

    @Override
    public List<EstadoOportunidadResponseDTO> listar() {
        return estadoRepository.findAll().stream()
                .map(estadoMapper::entidadADTO)
                .toList();
    }

    @Override
    public EstadoOportunidadResponseDTO buscarPorId(Long id) {
        EstadoOportunidad estado = estadoRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Estado de oportunidad no encontrado"));
        return estadoMapper.entidadADTO(estado);
    }

    @Override
    @Transactional
    public EstadoOportunidadResponseDTO crear(EstadoOportunidadRequestDTO dto) {
        if (estadoRepository.findByNombre(dto.nombre()).isPresent()) {
            throw new BusinessRuleException("Ya existe un estado con ese nombre");
        }
        return estadoMapper.entidadADTO(estadoRepository.save(estadoMapper.DTOAEntidad(dto)));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        EstadoOportunidad estado = estadoRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Estado de oportunidad no encontrado"));
        estadoRepository.delete(estado);
    }
}
