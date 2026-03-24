package com.extrucol.crm.service.impl;

import com.extrucol.crm.dto.request.ClienteRequestDTO;
import com.extrucol.crm.dto.response.ClienteResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.mapper.ClienteMapper;
import com.extrucol.crm.model.Cliente;
import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.ClienteRepository;
import com.extrucol.crm.repository.UsuarioRepository;
import com.extrucol.crm.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    private final ClienteMapper clienteMapper;

    @Override
    public ClienteResponseDTO crear(ClienteRequestDTO dto) {

        if(clienteRepository.existsByEmail(dto.email())){
            throw new BusinessRuleException("El correo ya está registrado");
        }

        Usuario usuario = usuarioRepository.findById(dto.usuario())
                .orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        return clienteMapper.entidadADTO(clienteRepository.save(clienteMapper.DTOAEntidad(dto,usuario)));
    }

    @Override
    public List<ClienteResponseDTO> listar() {
        return clienteRepository.findAll().stream().map(clienteMapper::entidadADTO).toList();
    }

    @Override
    public ClienteResponseDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Cliente no encontrado"));
        return clienteMapper.entidadADTO(cliente);
    }

    @Override
    public ClienteResponseDTO actualizar(Long id, ClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Cliente no encontrado"));

        clienteMapper.actualizarEntidadDesdeDTO(cliente, dto);
        clienteRepository.save(cliente);

        return clienteMapper.entidadADTO(cliente);
    }

    @Override
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }
}
