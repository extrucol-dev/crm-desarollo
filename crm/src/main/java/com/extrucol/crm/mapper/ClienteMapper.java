package com.extrucol.crm.mapper;

import com.extrucol.crm.dto.request.ClienteRequestDTO;
import com.extrucol.crm.dto.response.ClienteResponseDTO;
import com.extrucol.crm.model.Cliente;
import com.extrucol.crm.model.Usuario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ClienteMapper {

    public ClienteResponseDTO entidadADTO(Cliente cliente){
        if(cliente == null) return null;

        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getEmpresa(),
                cliente.getSector(),
                cliente.getCiudad(),
                cliente.getTelefono(),
                cliente.getEmail()
        );
    }

    public Cliente DTOAEntidad(ClienteRequestDTO dto, Usuario usuario){
        if(dto == null) return null;

        Cliente cliente = new Cliente();
                cliente.setNombre(dto.nombre());
                cliente.setEmpresa(dto.empresa());
                cliente.setSector(dto.sector());
                cliente.setCiudad(dto.ciudad());
                cliente.setTelefono(dto.telefono());
                cliente.setEmail(dto.email());
                cliente.setUsuario(usuario);
                cliente.setFecha_creacion(LocalDateTime.now());

        return cliente;
    }

    public void actualizarEntidadDesdeDTO(Cliente cliente, ClienteRequestDTO dto){
        if(dto == null) return;

        cliente.setNombre(dto.nombre());
        cliente.setEmpresa(dto.empresa());
        cliente.setSector(dto.sector());
        cliente.setCiudad(dto.ciudad());
        cliente.setTelefono(dto.telefono());
        cliente.setEmail(dto.email());
    }

}
