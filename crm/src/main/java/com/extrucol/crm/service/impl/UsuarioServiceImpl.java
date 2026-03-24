package com.extrucol.crm.service.impl;

import com.extrucol.crm.dto.request.UsuarioEstadoRequestDTO;
import com.extrucol.crm.dto.request.UsuarioRequestDTO;
import com.extrucol.crm.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.mapper.UsuarioMapper;
import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.UsuarioRepository;
import com.extrucol.crm.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;


    @Override
    public UsuarioResponseDTO crear(UsuarioRequestDTO dto) {
        if(usuarioRepository.existsByEmail(dto.email())){
            throw new BusinessRuleException("El correo ya está registrado");
        }
        return usuarioMapper.entidadADTO(usuarioRepository.save(usuarioMapper.DTOAEntidad(dto)));
    }

    @Override
    public List<UsuarioResponseDTO> listar() {
        return usuarioRepository.findAll().stream().map(usuarioMapper::entidadADTO).toList();
    }

    @Override
    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));
        return usuarioMapper.entidadADTO(usuario);
    }
    @Override
    public UsuarioResponseDTO actualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        usuarioMapper.actualizarEntidadDesdeDTO(usuario, dto);
        usuarioRepository.save(usuario);

        return usuarioMapper.entidadADTO(usuario);
    }

    @Override
    public UsuarioResponseDTO actualizarEstado(Long id, UsuarioEstadoRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        usuarioMapper.actualizarEstadoDesdeDTO(usuario, dto);
        usuarioRepository.save(usuario);

        return usuarioMapper.entidadADTO(usuario);
    }

    @Override
    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }
}
