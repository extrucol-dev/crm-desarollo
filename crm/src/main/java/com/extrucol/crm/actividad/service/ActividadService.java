package com.extrucol.crm.actividad.service;

import com.extrucol.crm.actividad.dto.request.ActividadCierreRequestDTO;
import com.extrucol.crm.actividad.dto.request.ActividadRequestDTO;
import com.extrucol.crm.actividad.dto.response.ActividadResponseDTO;
import com.extrucol.crm.actividad.dto.response.ActividadSimpleResposeDTO;
import com.extrucol.crm.actividad.dto.response.ActividadUbicacionResponseDTO;

import java.time.LocalDate;
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
