package com.extrucol.crm.service.impl;

import com.extrucol.crm.dto.request.OportunidadEstadoRequestDTO;
import com.extrucol.crm.dto.request.OportunidadRequestDTO;
import com.extrucol.crm.dto.response.OportunidadResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.mapper.OportunidadMapper;
import com.extrucol.crm.model.Cliente;
import com.extrucol.crm.model.Oportunidad;
import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.ClienteRepository;
import com.extrucol.crm.repository.OportunidadRepository;

import com.extrucol.crm.repository.UsuarioRepository;
import com.extrucol.crm.service.OportunidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class OportunidadServiceImpl implements OportunidadService {

    private final OportunidadRepository oportunidadRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    private final OportunidadMapper oportunidadMapper;

    @Override
    public OportunidadResponseDTO crear(OportunidadRequestDTO dto) {
        System.out.println(dto);

        Cliente cliente = clienteRepository.findById(dto.cliente())
                .orElseThrow(() -> new BusinessRuleException("Cliente no encontrado"));

        Usuario usuario = usuarioRepository.findById(dto.usuario())
                .orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        return oportunidadMapper.entidadADTO(oportunidadRepository.save(oportunidadMapper.crearDTOAEntidad(dto,cliente,usuario)));
    }

    @Override
    public List<OportunidadResponseDTO> listar() {
        return oportunidadRepository.findAll().stream().map(oportunidadMapper::entidadADTO).toList();
    }

    @Override
    public OportunidadResponseDTO buscarPorId(Long id) {
               Oportunidad oportunidad = oportunidadRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Oportunidad no encontrada"));
        return oportunidadMapper.entidadADTO(oportunidad);
    }

    @Override
    public OportunidadResponseDTO actualizar(Long id, OportunidadRequestDTO dto) {
        Oportunidad oportunidad = oportunidadRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Oportunidad no encontrada"));

        oportunidadMapper.actualizarEntidadDesdeDTO(oportunidad, dto);
        oportunidadRepository.save(oportunidad);
        return oportunidadMapper.entidadADTO(oportunidad);
    }

    @Override
    public OportunidadResponseDTO actualizarEstado(Long id, OportunidadEstadoRequestDTO dto) {
        Oportunidad oportunidad = oportunidadRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Oportunidad no encontrada"));

        oportunidadMapper.actualizarEstadoDesdeDTO(oportunidad, dto);
        oportunidadRepository.save(oportunidad);

        return oportunidadMapper.entidadADTO(oportunidad);
    }

    @Override
    public void eliminar(Long id) {
        oportunidadRepository.deleteById(id);
    }
}
