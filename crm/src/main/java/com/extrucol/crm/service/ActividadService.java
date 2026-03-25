package com.extrucol.crm.service;

import com.extrucol.crm.dto.request.actividad.ActividadCierreRequestDTO;
import com.extrucol.crm.dto.request.actividad.ActividadRequestDTO;
import com.extrucol.crm.dto.response.actividad.ActividadResponseDTO;
import com.extrucol.crm.dto.response.actividad.ActividadUbicacionResponseDTO;

import java.util.List;

public interface ActividadService {
    ActividadResponseDTO crear(ActividadRequestDTO dto);

    List<ActividadResponseDTO> listar();

    ActividadResponseDTO buscarPorId(Long id);

    ActividadResponseDTO actualizar(Long id, ActividadRequestDTO dto);

    ActividadUbicacionResponseDTO cerrarActividad(Long id, ActividadCierreRequestDTO dto);

    void eliminar(Long id);
}
