package com.extrucol.crm.service.impl;

import com.extrucol.crm.dto.request.oportunidad.OportunidadCierreRequestDTO;
import com.extrucol.crm.dto.request.oportunidad.OportunidadEstadoRequestDTO;
import com.extrucol.crm.dto.request.oportunidad.OportunidadRequestDTO;
import com.extrucol.crm.dto.response.actividad.ActividadResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadActividadesResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.mapper.ActividadMapper;
import com.extrucol.crm.mapper.OportunidadMapper;
import com.extrucol.crm.model.Cliente;
import com.extrucol.crm.model.Oportunidad;
import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.ActividadRepository;
import com.extrucol.crm.repository.ClienteRepository;
import com.extrucol.crm.repository.OportunidadRepository;

import com.extrucol.crm.repository.UsuarioRepository;
import com.extrucol.crm.service.OportunidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class OportunidadServiceImpl implements OportunidadService {

    private final OportunidadRepository oportunidadRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ActividadRepository actividadRepository;

    private final OportunidadMapper oportunidadMapper;
    private final ActividadMapper actividadMapper;

    @Override
    public OportunidadResponseDTO crear(OportunidadRequestDTO dto) {

        Cliente cliente = clienteRepository.findById(dto.cliente()).orElseThrow(() -> new BusinessRuleException("Cliente no encontrado"));

        System.out.println();

        Usuario usuario = usuarioRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        return oportunidadMapper.entidadADTO(oportunidadRepository.save(oportunidadMapper.crearDTOAEntidad(dto, cliente, usuario)));
    }

    @Override
    public List<OportunidadResponseDTO> listarPorUsuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return oportunidadRepository
                .findByUsuarioEmail(email)
                .stream()
                .map(oportunidadMapper::entidadADTO)
                .toList();
    }

    @Override
    public List<OportunidadResponseDTO> listarTodas() {
        return oportunidadRepository
                .findAll()
                .stream()
                .map(oportunidadMapper::entidadADTO)
                .toList();
    }
    @Override
    public OportunidadActividadesResponseDTO buscarPorId(Long id) {
        List<ActividadResponseDTO> actividades;
        Oportunidad oportunidad = oportunidadRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Oportunidad no encontrada"));

        actividades = actividadRepository.findByOportunidadId(oportunidad.getId()).stream().map(actividadMapper::entidadADTO).toList();

        return oportunidadMapper.entidadADTOActividades(oportunidad,actividades);
    }

    @Override
    public OportunidadResponseDTO actualizar(Long id, OportunidadRequestDTO dto) {
        Oportunidad oportunidad = oportunidadRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Oportunidad no encontrada"));

        oportunidadMapper.actualizarEntidadDesdeDTO(oportunidad, dto);
        oportunidadRepository.save(oportunidad);
        return oportunidadMapper.entidadADTO(oportunidad);
    }

    @Override
    public OportunidadResponseDTO actualizarEstado(Long id, OportunidadEstadoRequestDTO dto) {
        Oportunidad oportunidad = oportunidadRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Oportunidad no encontrada"));

        oportunidadMapper.actualizarEstadoDesdeDTO(oportunidad, dto);
        oportunidadRepository.save(oportunidad);

        return oportunidadMapper.entidadADTO(oportunidad);
    }

    @Override
    public OportunidadResponseDTO cerrarOportunidad(Long id, OportunidadCierreRequestDTO dto) {
        Oportunidad oportunidad = oportunidadRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Oportunidad no encontrada"));

        oportunidadMapper.cierreDesdeDTO(oportunidad, dto);
        oportunidadRepository.save(oportunidad);

        return oportunidadMapper.entidadADTO(oportunidad);
    }

    @Override
    public void eliminar(Long id) {
        oportunidadRepository.deleteById(id);
    }
}
