package com.extrucol.crm.mapper;

import com.extrucol.crm.dto.request.ClienteRequestDTO;
import com.extrucol.crm.dto.response.cliente.ClienteOportunidadesResponseDTO;
import com.extrucol.crm.dto.response.cliente.ClienteResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadSimpleResponseDTO;
import com.extrucol.crm.model.catalogo.Ciudad;
import com.extrucol.crm.model.Contacto;
import com.extrucol.crm.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ClienteMapper {
private final CiudadMapper ciudadMapper;
    public ClienteResponseDTO entidadADTO(Contacto contacto) {
        if (contacto == null) return null;

        return new ClienteResponseDTO(contacto.getId(), contacto.getNombre(), contacto.getEmpresa(), contacto.getSector(), ciudadMapper.entidadADTO(contacto.getCiudad()) , contacto.getTelefono(), contacto.getEmail(), contacto.getFecha_creacion());
    }

    public ClienteOportunidadesResponseDTO entidadADTOOportunidades(Contacto contacto, List<OportunidadSimpleResponseDTO> oportunidades) {
        if (contacto == null) return null;

        return new ClienteOportunidadesResponseDTO(contacto.getId(), contacto.getNombre(), contacto.getEmpresa(), contacto.getSector(), ciudadMapper.entidadADTO(contacto.getCiudad()) , contacto.getTelefono(), contacto.getEmail(), contacto.getFecha_creacion(), oportunidades);
    }

    public Contacto DTOAEntidad(ClienteRequestDTO dto, Usuario usuario, Ciudad ciudad) {
        if (dto == null) return null;

        Contacto contacto = new Contacto();
        contacto.setNombre(dto.nombre());
        contacto.setEmpresa(dto.empresa());
        contacto.setSector(dto.sector());
        contacto.setCiudad(ciudad);
        contacto.setTelefono(dto.telefono());
        contacto.setEmail(dto.email());
        contacto.setUsuario(usuario);

        return contacto;
    }

    public void actualizarEntidadDesdeDTO(Contacto contacto, ClienteRequestDTO dto, Ciudad ciudad) {
        if (dto == null) return;

        contacto.setNombre(dto.nombre());
        contacto.setEmpresa(dto.empresa());
        contacto.setSector(dto.sector());
        contacto.setCiudad(ciudad);
        contacto.setTelefono(dto.telefono());
        contacto.setEmail(dto.email());
    }

}
