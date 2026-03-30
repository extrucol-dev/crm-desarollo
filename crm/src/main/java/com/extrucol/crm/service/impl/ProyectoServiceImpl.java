package com.extrucol.crm.service.impl;

import com.extrucol.crm.dto.request.proyecto.ProyectoEstadoRequestDTO;
import com.extrucol.crm.dto.request.proyecto.ProyectoRequestDTO;
import com.extrucol.crm.dto.response.ProyectoResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.mapper.ProyectoMapper;
import com.extrucol.crm.model.Oportunidad;
import com.extrucol.crm.model.Proyecto;
import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.OportunidadRepository;
import com.extrucol.crm.repository.ProyectoRepository;
import com.extrucol.crm.repository.UsuarioRepository;
import com.extrucol.crm.service.ProyectoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProyectoServiceImpl implements ProyectoService {
    private final ProyectoRepository proyectoRepository;
    private final OportunidadRepository oportunidadRepository;
    private final UsuarioRepository usuarioRepository;

    private final ProyectoMapper proyectoMapper;

    @Override
    public ProyectoResponseDTO crear(ProyectoRequestDTO dto) {

        Oportunidad oportunidad = oportunidadRepository.findById(dto.oportunidad()).orElseThrow(() -> new BusinessRuleException("Oportunidad no encontrado"));

        Usuario usuario = usuarioRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        return proyectoMapper.entidadADTO(proyectoRepository.save(proyectoMapper.crearDTOAEntidad(dto, oportunidad, usuario)));
    }

    @Override
    public List<ProyectoResponseDTO> listarPorUsuarioActual() {
        return proyectoRepository.findByUsuarioEmail(SecurityContextHolder.getContext().getAuthentication().getName()).stream().map(proyectoMapper::entidadADTO).toList();
    }

    @Override
    public List<ProyectoResponseDTO> listarTodos() {
        return proyectoRepository.findAll().stream().map(proyectoMapper::entidadADTO).toList();
    }


    @Override
    public ProyectoResponseDTO buscarPorId(Long id) {
        Proyecto proyecto = proyectoRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Proyecto no encontrada"));
        return proyectoMapper.entidadADTO(proyecto);
    }

    @Override
    public ProyectoResponseDTO actualizar(Long id, ProyectoRequestDTO dto) {
        Proyecto proyecto = proyectoRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Proyecto no encontrada"));

        proyectoMapper.actualizarEntidadDesdeDTO(proyecto, dto);
        proyectoRepository.save(proyecto);
        return proyectoMapper.entidadADTO(proyecto);
    }

    @Override
    public ProyectoResponseDTO actualizarEstado(Long id, ProyectoEstadoRequestDTO dto) {
        Proyecto proyecto = proyectoRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Proyecto no encontrada"));

        proyectoMapper.actualizarEstadoDesdeDTO(proyecto, dto);
        proyectoRepository.save(proyecto);

        return proyectoMapper.entidadADTO(proyecto);
    }


    @Override
    public void eliminar(Long id) {
        proyectoRepository.deleteById(id);
    }
}
