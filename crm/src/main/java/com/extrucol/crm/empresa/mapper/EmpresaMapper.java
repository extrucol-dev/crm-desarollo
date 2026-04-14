package com.extrucol.crm.empresa.mapper;

import com.extrucol.crm.empresa.dto.request.EmpresaRequestDTO;
import com.extrucol.crm.empresa.dto.response.EmpresaResponseDTO;
import com.extrucol.crm.empresa.model.Empresa;
import com.extrucol.crm.empresa.model.catalogo.Documento;
import com.extrucol.crm.empresa.model.catalogo.Modalidad;
import com.extrucol.crm.empresa.model.catalogo.Municipio;
import com.extrucol.crm.empresa.model.catalogo.Sector;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmpresaMapper {

    /**
     * Convierte entidad Empresa a EmpresaResponseDTO
     */
    public EmpresaResponseDTO entidadADTO(Empresa empresa) {
        if (empresa == null) return null;

        return new EmpresaResponseDTO(
                empresa.getId(),
                empresa.getNombre(),
                empresa.getDireccion(),
                empresa.getMunicipio().getNombre(),
                empresa.getMunicipio().getDepartamento().getNombre(),
                empresa.getSector().getNombre(),
                empresa.getTipoDocumento().getTipo(),
                empresa.getNoDocumento(),
                empresa.getModalidad().getTipo(),
                empresa.getFecha_creacion()
        );
    }

    /**
     * Convierte EmpresaRequestDTO a entidad Empresa
     */
    public Empresa DTOAEntidad(
            EmpresaRequestDTO dto,
            Municipio municipio,
            Documento documento,
            Sector sector,
            Modalidad modalidad) {
        if (dto == null) return null;

        Empresa empresa = new Empresa();
        empresa.setNombre(dto.nombre());
        empresa.setDireccion(dto.direccion());
        empresa.setMunicipio(municipio);
        empresa.setTipoDocumento(documento);
        empresa.setNoDocumento(dto.no_documento());
        empresa.setSector(sector);
        empresa.setModalidad(modalidad);

        return empresa;
    }

    /**
     * Actualiza una entidad Empresa desde EmpresaRequestDTO
     */
    public void actualizarEntidadDesdeDTO(
            Empresa empresa,
            EmpresaRequestDTO dto,
            Municipio municipio,
            Documento documento,
            Sector sector,
            Modalidad modalidad) {
        if (dto == null) return;

        empresa.setNombre(dto.nombre());
        empresa.setDireccion(dto.direccion());
        empresa.setMunicipio(municipio);
        empresa.setTipoDocumento(documento);
        empresa.setNoDocumento(dto.no_documento());
        empresa.setSector(sector);
        empresa.setModalidad(modalidad);
    }
}
