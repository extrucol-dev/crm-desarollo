package com.extrucol.crm.oportunidad.service;

import com.extrucol.crm.oportunidad.dto.request.OportunidadCierreRequestDTO;
import com.extrucol.crm.oportunidad.dto.request.OportunidadEstadoRequestDTO;
import com.extrucol.crm.oportunidad.dto.request.OportunidadRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.OportunidadActividadesResponseDTO;
import com.extrucol.crm.oportunidad.dto.response.OportunidadDetalleResponseDTO;
import com.extrucol.crm.oportunidad.dto.response.OportunidadResponseDTO;

import java.util.List;

public interface OportunidadService {
    OportunidadResponseDTO crear(OportunidadRequestDTO dto);

    List<OportunidadResponseDTO> listarTodas();

    List<OportunidadResponseDTO> listarPorUsuarioActual();

    OportunidadActividadesResponseDTO buscarPorIdUsuarioActual(Long id);
    OportunidadDetalleResponseDTO buscarPorId(Long id);

    OportunidadResponseDTO actualizar(Long id, OportunidadRequestDTO dto);

    OportunidadResponseDTO actualizarEstado(Long id, OportunidadEstadoRequestDTO dto);

    OportunidadResponseDTO cerrarOportunidad(Long id, OportunidadCierreRequestDTO dto);

    void eliminar(Long id);

}
