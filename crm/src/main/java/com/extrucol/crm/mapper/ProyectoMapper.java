package com.extrucol.crm.mapper;

import com.extrucol.crm.dto.request.proyecto.ProyectoEstadoRequestDTO;
import com.extrucol.crm.dto.request.proyecto.ProyectoRequestDTO;
import com.extrucol.crm.dto.response.ProyectoResponseDTO;
import com.extrucol.crm.model.Cliente;
import com.extrucol.crm.model.Oportunidad;
import com.extrucol.crm.model.Proyecto;
import com.extrucol.crm.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class ProyectoMapper {
    private final UsuarioMapper usuarioMapper;
    private final OportunidadMapper oportunidadMapper;

    public ProyectoResponseDTO entidadADTO(Proyecto proyecto) {
        if (proyecto == null) return null;

        return new ProyectoResponseDTO(proyecto.getId(), proyecto.getNombre(), proyecto.getDescripcion(), proyecto.getEstado(), oportunidadMapper.entidadADTO(proyecto.getOportunidad()), usuarioMapper.entidadADTO(proyecto.getUsuario()), proyecto.getFecha_creacion());
    }

    public Proyecto crearDTOAEntidad(ProyectoRequestDTO dto, Oportunidad oportunidad, Usuario usuario) {
        if (dto == null) return null;

        Proyecto proyecto = new Proyecto();
        proyecto.setNombre(dto.nombre());
        proyecto.setDescripcion(dto.descripcion());
        proyecto.setEstado(dto.estado());
        proyecto.setUsuario(usuario);
        proyecto.setOportunidad(oportunidad);
        proyecto.setFecha_actualizacion(LocalDateTime.now());
        proyecto.setFecha_creacion(LocalDateTime.now());
        return proyecto;
    }

    public void actualizarEntidadDesdeDTO(Proyecto proyecto, ProyectoRequestDTO dto) {
        if (dto == null) return;

        proyecto.setNombre(dto.nombre());
        proyecto.setDescripcion(dto.descripcion());
        proyecto.setEstado(dto.estado());
        proyecto.setFecha_actualizacion(LocalDateTime.now());
    }

    public void actualizarEstadoDesdeDTO(Proyecto proyecto, ProyectoEstadoRequestDTO dto) {
        if (dto == null) return;
        proyecto.setEstado(dto.estado());
    }
}
