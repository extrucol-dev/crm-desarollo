package com.extrucol.crm.oportunidad.service.impl;

import com.extrucol.crm.oportunidad.dto.request.OportunidadCierreRequestDTO;
import com.extrucol.crm.oportunidad.dto.request.OportunidadEstadoRequestDTO;
import com.extrucol.crm.oportunidad.dto.request.OportunidadRequestDTO;
import com.extrucol.crm.actividad.dto.response.ActividadResponseDTO;
import com.extrucol.crm.oportunidad.dto.response.OportunidadActividadesResponseDTO;
import com.extrucol.crm.oportunidad.dto.response.OportunidadDetalleResponseDTO;
import com.extrucol.crm.oportunidad.dto.response.OportunidadResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.actividad.mapper.ActividadMapper;
import com.extrucol.crm.oportunidad.mapper.OportunidadMapper;
import com.extrucol.crm.contacto.model.Cliente;
import com.extrucol.crm.oportunidad.model.Oportunidad;
import com.extrucol.crm.usuario.model.Usuario;
import com.extrucol.crm.actividad.repository.ActividadRepository;
import com.extrucol.crm.contacto.repository.ClienteRepository;
import com.extrucol.crm.oportunidad.repository.OportunidadRepository;

import com.extrucol.crm.usuario.repository.UsuarioRepository;
import com.extrucol.crm.oportunidad.service.OportunidadService;
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
    public OportunidadDetalleResponseDTO buscarPorId(Long id) {
        List<ActividadResponseDTO> actividades;
        Oportunidad oportunidad = oportunidadRepository
                .findById(id)
                .orElseThrow(
                        () -> new BusinessRuleException("Oportunidad no encontrada"));

        actividades = actividadRepository
                .findByOportunidadId(
                        oportunidad.getId())
                .stream().
                map(actividadMapper::entidadADTO)
                .toList();

        return oportunidadMapper.entidadADTODetalles(oportunidad,actividades);
    }

    @Override
    public OportunidadActividadesResponseDTO buscarPorIdUsuarioActual(Long id) {
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
