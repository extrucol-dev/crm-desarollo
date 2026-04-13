package com.extrucol.crm.usuario.mapper;

import com.extrucol.crm.usuario.dto.request.UsuarioEstadoRequestDTO;
import com.extrucol.crm.usuario.dto.request.UsuarioRequestDTO;
import com.extrucol.crm.usuario.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.usuario.model.Usuario;
import org.springframework.stereotype.Component;


@Component
public class UsuarioMapper {

    public UsuarioResponseDTO entidadADTO(Usuario usuario){
        if(usuario == null) return null;

        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
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

    public void actualizarEstadoDesdeDTO(Usuario u, UsuarioEstadoRequestDTO dto){
        if(dto == null) return;

        u.setActivo(dto.activo());
    }
}
