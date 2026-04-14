package com.extrucol.crm.empresa.service;

import com.extrucol.crm.empresa.dto.request.EmpresaRequestDTO;
import com.extrucol.crm.empresa.dto.request.EmpresaEstadoRequestDTO;
import com.extrucol.crm.empresa.dto.response.EmpresaResponseDTO;

import java.util.List;

public interface EmpresaService {

    /**
     * Crea una nueva empresa
     * Valida que todos los catálogos existan
     * Valida que no exista empresa con el mismo número de documento
     */
    EmpresaResponseDTO crear(EmpresaRequestDTO dto);

    /**
     * Lista todas las empresas (activas e inactivas)
     */
    List<EmpresaResponseDTO> listar();

    /**
     * Lista solo las empresas activas
     */
    List<EmpresaResponseDTO> listarActivas();

    /**
     * Busca una empresa por ID
     */
    EmpresaResponseDTO buscarPorId(Long id);

    /**
     * Actualiza una empresa existente
     * Valida que el nuevo documento no esté registrado en otra empresa
     */
    EmpresaResponseDTO actualizar(Long id, EmpresaRequestDTO dto);

    /**
     * Cambia el estado (activo/inactivo) de una empresa
     */
    void cambiarEstado(Long id, EmpresaEstadoRequestDTO dto);

    /**
     * Elimina una empresa
     * Valida que no tenga clientes asociados
     */
    void eliminar(Long id);
}
