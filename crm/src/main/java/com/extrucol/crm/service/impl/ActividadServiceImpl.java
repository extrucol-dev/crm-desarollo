package com.extrucol.crm.service.impl;

import com.extrucol.crm.dto.request.actividad.ActividadCierreRequestDTO;
import com.extrucol.crm.dto.request.actividad.ActividadRequestDTO;
import com.extrucol.crm.dto.response.actividad.ActividadResponseDTO;
import com.extrucol.crm.dto.response.actividad.ActividadUbicacionResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.mapper.ActividadMapper;
import com.extrucol.crm.mapper.UbicacionMapper;
import com.extrucol.crm.model.Actividad;
import com.extrucol.crm.model.Oportunidad;
import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.ActividadRepository;
import com.extrucol.crm.repository.OportunidadRepository;
import com.extrucol.crm.repository.UbicacionRepository;
import com.extrucol.crm.repository.UsuarioRepository;
import com.extrucol.crm.service.ActividadService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActividadServiceImpl implements ActividadService {
    private final ActividadRepository actividadRepository;
    private final UsuarioRepository usuarioRepository;
    private final OportunidadRepository oportunidadRepository;
    private final UbicacionRepository ubicacionRepository;


    private final ActividadMapper actividadMapper;
    private final UbicacionMapper ubicacionMapper;

    @Override
    public ActividadResponseDTO crear(ActividadRequestDTO dto) {

        Oportunidad oportunidad = oportunidadRepository.findById(dto.oportunidad()).orElseThrow(() -> new BusinessRuleException("Oportunidad no encontrado"));



        Usuario usuario = usuarioRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        return actividadMapper.entidadADTO(actividadRepository.save(actividadMapper.DTOAEntidad(dto, usuario, oportunidad)));
    }

    @Override
    public List<ActividadResponseDTO> listar(LocalDate inicio, LocalDate fin) {

        if (inicio != null && fin != null && inicio.isAfter(fin)) {
            throw new BusinessRuleException("La fecha de inicio no puede ser mayor que la fecha fin");
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return actividadRepository
                .filtrarPorFechaYUsuario(inicio, fin, email)
                .stream()
                .map(actividadMapper::entidadADTO)
                .toList();
    }

    @Override
    public List<ActividadResponseDTO> listarTodas(LocalDate inicio, LocalDate fin) {

        if (inicio != null && fin != null && inicio.isAfter(fin)) {
            throw new BusinessRuleException("La fecha de inicio no puede ser mayor que la fecha fin");
        }

        return actividadRepository
                .filtrarPorFecha(inicio, fin)
                .stream()
                .map(actividadMapper::entidadADTO)
                .toList();
    }

    @Override
    public ActividadResponseDTO buscarPorId(Long id) {
        Actividad actividad = actividadRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Actividad no encontrado"));
        return actividadMapper.entidadADTO(actividad);
    }

    @Override
    public ActividadResponseDTO actualizar(Long id, ActividadRequestDTO dto) {
        Actividad actividad = actividadRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Actividad no encontrada"));

        actividadMapper.actualizarEntidadDesdeDTO(actividad, dto);
        actividadRepository.save(actividad);
        return actividadMapper.entidadADTO(actividad);
    }

    @Override
    @Transactional
    public ActividadUbicacionResponseDTO cerrarActividad(Long id, ActividadCierreRequestDTO dto) {
        Actividad actividad = actividadRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Actividad no encontrada"));

        actividadMapper.marcarResultadoDesdeDTO(actividad, dto);
        actividadRepository.save(actividad);
        return actividadMapper.entidadADTOUbicacion(actividad, ubicacionRepository.save(ubicacionMapper.crearEntidad(dto, actividad)));
    }

    @Override
    public void eliminar(Long id) {
        actividadRepository.deleteById(id);
    }
}
