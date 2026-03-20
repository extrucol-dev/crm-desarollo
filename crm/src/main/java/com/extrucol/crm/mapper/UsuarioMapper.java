package com.extrucol.crm.mapper;

import com.extrucol.crm.dto.request.UsuarioRequestDTO;
import com.extrucol.crm.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.model.Usuario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO entidadADTO(Usuario usuario){
        if(usuario == null) return null;

        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getPassword(),
                usuario.getRol(),
                usuario.getActivo()

        );
    }

    public Usuario DTOAEntidad(UsuarioRequestDTO dto){
        if(dto == null) return null;

        Usuario u = new Usuario();
        u.setNombre(dto.nombre());
        u.setEmail(dto.email());
        u.setPassword(dto.password());
        u.setActivo(dto.activo());
        u.setRol(dto.rol());
        u.setFecha_creacion(LocalDateTime.now());

        return u;
    }

    public void actualizarEntidadDesdeDTO(Usuario u, UsuarioRequestDTO dto){
        if(dto == null) return;

        u.setNombre(dto.nombre());
        u.setEmail(dto.email());
        u.setPassword(dto.password());
        u.setActivo(dto.activo());
        u.setRol(dto.rol());
    }
}
