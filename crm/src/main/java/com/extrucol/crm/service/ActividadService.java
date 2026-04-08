package com.extrucol.crm.service;

import com.extrucol.crm.dto.request.actividad.ActividadCierreRequestDTO;
import com.extrucol.crm.dto.request.actividad.ActividadRequestDTO;
import com.extrucol.crm.dto.response.actividad.ActividadResponseDTO;
import com.extrucol.crm.dto.response.actividad.ActividadSimpleResposeDTO;
import com.extrucol.crm.dto.response.actividad.ActividadUbicacionResponseDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ActividadService {
    ActividadResponseDTO crear(ActividadRequestDTO dto);

    List<ActividadResponseDTO> listar(LocalDate inicio, LocalDate fin);

    List<ActividadResponseDTO> listarTodas(LocalDate inicio, LocalDate fin);

    ActividadUbicacionResponseDTO buscarPorId(Long id);

    ActividadResponseDTO actualizar(Long id, ActividadRequestDTO dto);

    ActividadSimpleResposeDTO cerrarActividad(Long id, ActividadCierreRequestDTO dto);

    void eliminar(Long id);
}
