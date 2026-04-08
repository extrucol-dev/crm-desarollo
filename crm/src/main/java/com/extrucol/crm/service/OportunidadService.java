package com.extrucol.crm.service;

import com.extrucol.crm.dto.request.oportunidad.OportunidadCierreRequestDTO;
import com.extrucol.crm.dto.request.oportunidad.OportunidadEstadoRequestDTO;
import com.extrucol.crm.dto.request.oportunidad.OportunidadRequestDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadActividadesResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadDetalleResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadResponseDTO;

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
