package com.extrucol.crm.service.impl;

import com.extrucol.crm.dto.request.ClienteRequestDTO;
import com.extrucol.crm.dto.response.cliente.ClienteOportunidadesResponseDTO;
import com.extrucol.crm.dto.response.cliente.ClienteResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadSimpleResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.mapper.ClienteMapper;
import com.extrucol.crm.mapper.OportunidadMapper;
import com.extrucol.crm.model.Ciudad;
import com.extrucol.crm.model.Cliente;
import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.CiudadRepository;
import com.extrucol.crm.repository.ClienteRepository;
import com.extrucol.crm.repository.OportunidadRepository;
import com.extrucol.crm.repository.UsuarioRepository;
import com.extrucol.crm.service.ClienteService;
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
        Ciudad ciudad = ciudadRepository.findById(dto.ciudad()).orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        clienteMapper.actualizarEntidadDesdeDTO(cliente, dto,ciudad);
        clienteRepository.save(cliente);

        return clienteMapper.entidadADTO(cliente);
    }

    @Override
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }
}
