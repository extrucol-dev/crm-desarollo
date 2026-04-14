package com.extrucol.crm.contacto.mapper;

import com.extrucol.crm.contacto.dto.request.ClienteRequestDTO;
import com.extrucol.crm.contacto.dto.response.ClienteOportunidadesResponseDTO;
import com.extrucol.crm.contacto.dto.response.ClienteResponseDTO;
import com.extrucol.crm.contacto.dto.response.EmailResponseDTO;
import com.extrucol.crm.contacto.dto.response.TelefonoResponseDTO;
import com.extrucol.crm.oportunidad.dto.response.OportunidadSimpleResponseDTO;
import com.extrucol.crm.empresa.model.Empresa;
import com.extrucol.crm.contacto.model.Cliente;
import com.extrucol.crm.contacto.model.catalogo.Email;
import com.extrucol.crm.contacto.model.catalogo.Telefono;
import com.extrucol.crm.usuario.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ClienteMapper {

    /**
     * Convierte una entidad Cliente a ClienteResponseDTO (sin oportunidades)
     */
    public ClienteResponseDTO entidadADTO(Cliente cliente) {
        if (cliente == null) return null;

        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getEmpresa().getId(),  // empresa_id
                cliente.getEmpresa().getNombre(),  // empresa_nombre
                cliente.getTelefonos().stream()
                        .map(t -> new TelefonoResponseDTO(t.getId(), t.getNumero()))
                        .collect(Collectors.toList()),
                cliente.getEmails().stream()
                        .map(e -> new EmailResponseDTO(e.getId(), e.getEmail()))
                        .collect(Collectors.toList()),
                cliente.getFecha_creacion()
        );
    }

    /**
     * Convierte una entidad Cliente a ClienteOportunidadesResponseDTO (con oportunidades)
     */
    public ClienteOportunidadesResponseDTO entidadADTOOportunidades(
            Cliente cliente,
            List<OportunidadSimpleResponseDTO> oportunidades) {
        if (cliente == null) return null;

        return new ClienteOportunidadesResponseDTO(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getEmpresa().getNombre(),
                cliente.getTelefonos().stream()
                        .map(Telefono::getNumero)
                        .collect(Collectors.joining(", ")),
                cliente.getEmails().stream()
                        .map(Email::getEmail)
                        .collect(Collectors.joining(", ")),
                cliente.getFecha_creacion(),
                oportunidades
        );
    }

    /**
     * Convierte ClienteRequestDTO a entidad Cliente
     * Procesa las listas de telefonos y emails
     */
    public Cliente DTOAEntidad(ClienteRequestDTO dto, Usuario usuario, Empresa empresa) {
        if (dto == null) return null;

        Cliente cliente = new Cliente();
        cliente.setNombre(dto.nombre());
        cliente.setEmpresa(empresa);  //
        cliente.setUsuario(usuario);

        // ✅ Procesar lista de teléfonos
        if (dto.telefonos() != null && !dto.telefonos().isEmpty()) {
            List<Telefono> telefonos = dto.telefonos().stream()
                    .map(tDTO -> new Telefono(null, tDTO.telefono(), cliente))
                    .collect(Collectors.toList());
            cliente.setTelefonos(telefonos);
        } else {
            cliente.setTelefonos(new ArrayList<>());
        }

        // ✅ Procesar lista de emails
        if (dto.emails() != null && !dto.emails().isEmpty()) {
            List<Email> emails = dto.emails().stream()
                    .map(eDTO -> new Email(null, eDTO.email(), cliente))
                    .collect(Collectors.toList());
            cliente.setEmails(emails);
        } else {
            cliente.setEmails(new ArrayList<>());
        }

        return cliente;
    }

    /**
     * Actualiza una entidad Cliente existente desde un ClienteRequestDTO
     */
    public void actualizarEntidadDesdeDTO(Cliente cliente, ClienteRequestDTO dto, Empresa empresa) {
        if (dto == null) return;

        cliente.setNombre(dto.nombre());
        cliente.setEmpresa(empresa);  //

        // ✅ Actualizar lista de teléfonos
        if (dto.telefonos() != null && !dto.telefonos().isEmpty()) {
            cliente.getTelefonos().clear();
            List<Telefono> nuevosTelefonos = dto.telefonos().stream()
                    .map(tDTO -> new Telefono(null, tDTO.telefono(), cliente))
                    .collect(Collectors.toList());
            cliente.setTelefonos(nuevosTelefonos);
        }

        // ✅ Actualizar lista de emails
        if (dto.emails() != null && !dto.emails().isEmpty()) {
            cliente.getEmails().clear();
            List<Email> nuevosEmails = dto.emails().stream()
                    .map(eDTO -> new Email(null, eDTO.email(), cliente))
                    .collect(Collectors.toList());
            cliente.setEmails(nuevosEmails);
        }
    }
}
