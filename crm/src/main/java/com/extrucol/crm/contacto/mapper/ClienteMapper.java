package com.extrucol.crm.contacto.mapper;

import com.extrucol.crm.contacto.dto.request.ClienteRequestDTO;
import com.extrucol.crm.contacto.dto.response.ClienteOportunidadesResponseDTO;
import com.extrucol.crm.contacto.dto.response.ClienteResponseDTO;
import com.extrucol.crm.empresa.mapper.CiudadMapper;
import com.extrucol.crm.oportunidad.dto.response.OportunidadSimpleResponseDTO;
import com.extrucol.crm.empresa.model.catalogo.Ciudad;
import com.extrucol.crm.contacto.model.Cliente;
import com.extrucol.crm.usuario.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ClienteMapper {
private final CiudadMapper ciudadMapper;
    public ClienteResponseDTO entidadADTO(Cliente cliente) {
        if (cliente == null) return null;

        return new ClienteResponseDTO(cliente.getId(), cliente.getNombre(), cliente.getEmpresa(), cliente.getSector(), cliente.getTelefono(), cliente.getEmail(), cliente.getFecha_creacion());
    }

    public ClienteOportunidadesResponseDTO entidadADTOOportunidades(Cliente cliente, List<OportunidadSimpleResponseDTO> oportunidades) {
        if (cliente == null) return null;

        return new ClienteOportunidadesResponseDTO(cliente.getId(), cliente.getNombre(), cliente.getEmpresa(), cliente.getSector(), cliente.getTelefono(), cliente.getEmail(), cliente.getFecha_creacion(), oportunidades);
    }

    public Cliente DTOAEntidad(ClienteRequestDTO dto, Usuario usuario, Ciudad ciudad) {
        if (dto == null) return null;

        Cliente cliente = new Cliente();
        cliente.setNombre(dto.nombre());
        cliente.setEmpresa(dto.empresa());
        cliente.setSector(dto.sector());
        cliente.setTelefono(dto.telefono());
        cliente.setEmail(dto.email());
        cliente.setUsuario(usuario);

        return cliente;
    }

    public void actualizarEntidadDesdeDTO(Cliente cliente, ClienteRequestDTO dto) {
        if (dto == null) return;

        cliente.setNombre(dto.nombre());
        cliente.setEmpresa(dto.empresa());
        cliente.setSector(dto.sector());
        cliente.setTelefono(dto.telefono());
        cliente.setEmail(dto.email());
    }

}
