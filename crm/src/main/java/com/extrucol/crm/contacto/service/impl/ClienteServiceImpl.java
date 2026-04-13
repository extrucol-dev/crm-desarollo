package com.extrucol.crm.contacto.service.impl;

import com.extrucol.crm.contacto.dto.request.ClienteRequestDTO;
import com.extrucol.crm.contacto.dto.response.ClienteOportunidadesResponseDTO;
import com.extrucol.crm.contacto.dto.response.ClienteResponseDTO;
import com.extrucol.crm.oportunidad.dto.response.OportunidadSimpleResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.contacto.mapper.ClienteMapper;
import com.extrucol.crm.oportunidad.mapper.OportunidadMapper;
import com.extrucol.crm.empresa.model.catalogo.Ciudad;
import com.extrucol.crm.contacto.model.Cliente;
import com.extrucol.crm.usuario.model.Usuario;
import com.extrucol.crm.empresa.repository.CiudadRepository;
import com.extrucol.crm.contacto.repository.ClienteRepository;
import com.extrucol.crm.oportunidad.repository.OportunidadRepository;
import com.extrucol.crm.usuario.repository.UsuarioRepository;
import com.extrucol.crm.contacto.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final OportunidadRepository oportunidadRepository;
    private final UsuarioRepository usuarioRepository;
    private final CiudadRepository ciudadRepository;

    private final ClienteMapper clienteMapper;
    private final OportunidadMapper oportunidadMapper;

    @Override
    public ClienteResponseDTO crear(ClienteRequestDTO dto) {

        if (clienteRepository.existsByEmail(dto.email())) {
            throw new BusinessRuleException("El correo ya está registrado");
        }

        Usuario usuario = usuarioRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        Ciudad ciudad = ciudadRepository.findById(dto.ciudad()).orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        return clienteMapper.entidadADTO(clienteRepository.save(clienteMapper.DTOAEntidad(dto, usuario,ciudad)));
    }

    @Override
    public List<ClienteResponseDTO> listar() {
        return clienteRepository.findAll().stream().map(clienteMapper::entidadADTO).toList();
    }

    @Override
    public List<ClienteResponseDTO> listarPorEjecutivo() {


        return  clienteRepository.findByUsuarioEmail(SecurityContextHolder.getContext().getAuthentication().getName()).stream().map(clienteMapper::entidadADTO).toList();
    }

    @Override
    public ClienteOportunidadesResponseDTO buscarPorId(Long id) {
        List<OportunidadSimpleResponseDTO> oportunidades;
        Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Cliente no encontrado"));

         oportunidades = oportunidadRepository.findByClienteId(cliente.getId()).stream().map(oportunidadMapper::entidadADTOSimple).toList();

        return clienteMapper.entidadADTOOportunidades(cliente,oportunidades);
    }

    @Override
    public ClienteResponseDTO actualizar(Long id, ClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new BusinessRuleException("Cliente no encontrado"));

        clienteMapper.actualizarEntidadDesdeDTO(cliente, dto);
        clienteRepository.save(cliente);

        return clienteMapper.entidadADTO(cliente);
    }

    @Override
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }
}
