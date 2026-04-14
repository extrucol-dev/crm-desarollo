package com.extrucol.crm.empresa.service.impl;

import com.extrucol.crm.empresa.dto.request.EmpresaRequestDTO;
import com.extrucol.crm.empresa.dto.request.EmpresaEstadoRequestDTO;
import com.extrucol.crm.empresa.dto.response.EmpresaResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.empresa.mapper.EmpresaMapper;
import com.extrucol.crm.empresa.model.Empresa;
import com.extrucol.crm.empresa.model.catalogo.Documento;
import com.extrucol.crm.empresa.model.catalogo.Modalidad;
import com.extrucol.crm.empresa.model.catalogo.Municipio;
import com.extrucol.crm.empresa.model.catalogo.Sector;
import com.extrucol.crm.empresa.repository.DocumentoRepository;
import com.extrucol.crm.empresa.repository.EmpresaRepository;
import com.extrucol.crm.empresa.repository.ModalidadRepository;
import com.extrucol.crm.empresa.repository.MunicipioRepository;
import com.extrucol.crm.empresa.repository.SectorRepository;
import com.extrucol.crm.empresa.service.EmpresaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class EmpresaServiceImpl implements EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final MunicipioRepository municipioRepository;
    private final DocumentoRepository documentoRepository;
    private final SectorRepository sectorRepository;
    private final ModalidadRepository modalidadRepository;

    private final EmpresaMapper empresaMapper;

    @Override
    public EmpresaResponseDTO crear(EmpresaRequestDTO dto) {
        // Validar municipio
        Municipio municipio = municipioRepository.findById(dto.municipio_id())
                .orElseThrow(() -> new BusinessRuleException("Municipio no encontrado"));

        // Validar documento
        Documento documento = documentoRepository.findById(dto.tipo_documento_id())
                .orElseThrow(() -> new BusinessRuleException("Tipo de documento no encontrado"));

        // Validar sector ✨ NUEVO
        Sector sector = sectorRepository.findById(dto.sector_id())
                .orElseThrow(() -> new BusinessRuleException("Sector no encontrado"));

        // Validar modalidad
        Modalidad modalidad = modalidadRepository.findById(dto.modalidad_id())
                .orElseThrow(() -> new BusinessRuleException("Modalidad no encontrada"));

        // Validar que no exista empresa con el mismo documento
        if (empresaRepository.existsBynoDocumento(dto.no_documento())) {
            throw new BusinessRuleException("Ya existe una empresa registrada con este número de documento");
        }

        Empresa empresaNueva = empresaMapper.DTOAEntidad(dto, municipio, documento, sector, modalidad);
        Empresa empresaGuardada = empresaRepository.save(empresaNueva);

        return empresaMapper.entidadADTO(empresaGuardada);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpresaResponseDTO> listar() {
        return empresaRepository.findAll().stream()
                .map(empresaMapper::entidadADTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpresaResponseDTO> listarActivas() {
        return empresaRepository.findByActivoTrue().stream()
                .map(empresaMapper::entidadADTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EmpresaResponseDTO buscarPorId(Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Empresa no encontrada"));
        return empresaMapper.entidadADTO(empresa);
    }

    @Override
    public EmpresaResponseDTO actualizar(Long id, EmpresaRequestDTO dto) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Empresa no encontrada"));

        // Validar que el nuevo documento no esté registrado en otra empresa
        if (!empresa.getNoDocumento().equals(dto.no_documento()) &&
                empresaRepository.existsBynoDocumento(dto.no_documento())) {
            throw new BusinessRuleException("Ya existe una empresa con este número de documento");
        }

        // Validar municipio
        Municipio municipio = municipioRepository.findById(dto.municipio_id())
                .orElseThrow(() -> new BusinessRuleException("Municipio no encontrado"));

        // Validar documento
        Documento documento = documentoRepository.findById(dto.tipo_documento_id())
                .orElseThrow(() -> new BusinessRuleException("Tipo de documento no encontrado"));

        // Validar sector ✨ NUEVO
        Sector sector = sectorRepository.findById(dto.sector_id())
                .orElseThrow(() -> new BusinessRuleException("Sector no encontrado"));

        // Validar modalidad
        Modalidad modalidad = modalidadRepository.findById(dto.modalidad_id())
                .orElseThrow(() -> new BusinessRuleException("Modalidad no encontrada"));

        empresaMapper.actualizarEntidadDesdeDTO(empresa, dto, municipio, documento, sector, modalidad);
        Empresa empresaActualizada = empresaRepository.save(empresa);

        return empresaMapper.entidadADTO(empresaActualizada);
    }

    @Override
    public void cambiarEstado(Long id, EmpresaEstadoRequestDTO dto) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Empresa no encontrada"));

        empresa.setActivo(dto.activo());
        empresaRepository.save(empresa);
    }

    @Override
    public void eliminar(Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Empresa no encontrada"));

        // Validar que no tenga clientes asociados
        if (!empresa.getClientes().isEmpty()) {
            throw new BusinessRuleException("No se puede eliminar una empresa que tiene clientes asociados");
        }

        empresaRepository.delete(empresa);
    }
}
