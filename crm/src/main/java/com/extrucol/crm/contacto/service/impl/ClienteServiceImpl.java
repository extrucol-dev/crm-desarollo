
package com.extrucol.crm.contacto.service.impl;

import com.extrucol.crm.contacto.dto.request.ClienteRequestDTO;
import com.extrucol.crm.contacto.dto.response.ClienteOportunidadesResponseDTO;
import com.extrucol.crm.contacto.dto.response.ClienteResponseDTO;
import com.extrucol.crm.oportunidad.dto.response.OportunidadSimpleResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.contacto.mapper.ClienteMapper;
import com.extrucol.crm.oportunidad.mapper.OportunidadMapper;
import com.extrucol.crm.empresa.model.Empresa;
import com.extrucol.crm.contacto.model.Cliente;
import com.extrucol.crm.usuario.model.Usuario;
import com.extrucol.crm.empresa.repository.EmpresaRepository;
import com.extrucol.crm.contacto.repository.ClienteRepository;
import com.extrucol.crm.oportunidad.repository.OportunidadRepository;
import com.extrucol.crm.usuario.repository.UsuarioRepository;
import com.extrucol.crm.contacto.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final OportunidadRepository oportunidadRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;

    private final ClienteMapper clienteMapper;
    private final OportunidadMapper oportunidadMapper;

    @Override
    public ClienteResponseDTO crear(ClienteRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(
                SecurityContextHolder.getContext().getAuthentication().getName()
        ).orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        Empresa empresa = empresaRepository.findById(dto.empresa_id())
                .orElseThrow(() -> new BusinessRuleException("Empresa no encontrada"));

        Cliente clienteNuevo = clienteMapper.DTOAEntidad(dto, usuario, empresa);
        Cliente clienteGuardado = clienteRepository.save(clienteNuevo);

        return clienteMapper.entidadADTO(clienteGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listar() {
        return clienteRepository.findAll().stream()
                .map(clienteMapper::entidadADTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listarPorEjecutivo() {
        String emailEjecutivo = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return clienteRepository.findByUsuarioEmail(emailEjecutivo).stream()
                .map(clienteMapper::entidadADTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteOportunidadesResponseDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Cliente no encontrado"));

        List<OportunidadSimpleResponseDTO> oportunidades = oportunidadRepository
                .findByClienteId(cliente.getId()).stream()
                .map(oportunidadMapper::entidadADTOSimple)
                .toList();

        return clienteMapper.entidadADTOOportunidades(cliente, oportunidades);
    }

    @Override
    public ClienteResponseDTO actualizar(Long id, ClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Cliente no encontrado"));

        Empresa empresa = empresaRepository.findById(dto.empresa_id())
                .orElseThrow(() -> new BusinessRuleException("Empresa no encontrada"));

        clienteMapper.actualizarEntidadDesdeDTO(cliente, dto, empresa);

        Cliente clienteActualizado = clienteRepository.save(cliente);

        return clienteMapper.entidadADTO(clienteActualizado);
    }

    @Override
    public void eliminar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Cliente no encontrado"));

        clienteRepository.delete(cliente);
    }
}
