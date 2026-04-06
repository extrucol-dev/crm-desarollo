package com.extrucol.crm.mapper;


import com.extrucol.crm.dto.request.actividad.ActividadCierreRequestDTO;
import com.extrucol.crm.dto.request.actividad.ActividadRequestDTO;
import com.extrucol.crm.dto.response.actividad.ActividadResponseDTO;
import com.extrucol.crm.dto.response.actividad.ActividadUbicacionResponseDTO;
import com.extrucol.crm.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class ActividadMapper {
    private final UbicacionMapper ubicacionMapper;
    private final OportunidadMapper oportunidadMapper;
    private final UsuarioMapper usuarioMapper;

    public ActividadResponseDTO entidadADTO(Actividad actividad) {
        if (actividad == null) return null;

        return new ActividadResponseDTO(actividad.getId(),
                actividad.getTipo(),
                actividad.getDescripcion(),
                actividad.getResultado(),
                actividad.getVirtual(),
                actividad.getFecha_actividad(),
                usuarioMapper.entidadADTO(actividad.getUsuario()),
                oportunidadMapper.entidadADTOSimple(actividad.getOportunidad()));
    }

    public ActividadUbicacionResponseDTO entidadADTOUbicacion(Actividad actividad, Ubicacion ubicacion) {
        if (actividad == null) return null;

        return new ActividadUbicacionResponseDTO(actividad.getId(),
                actividad.getTipo(),
                actividad.getDescripcion(),
                actividad.getResultado(),
                actividad.getVirtual(),
                actividad.getFecha_actividad(),
                ubicacionMapper.entidadADTO(ubicacion)

        );
    }

    public Actividad DTOAEntidad(ActividadRequestDTO dto, Usuario usuario, Oportunidad oportunidad) {
        if (dto == null) return null;

        Actividad actividad = new Actividad();
        actividad.setTipo(dto.tipo());
        actividad.setDescripcion(dto.descripcion());
        actividad.setVirtual(dto.virtual());
        actividad.setFecha_actividad(dto.fecha_actividad());
        actividad.setOportunidad(oportunidad);
        actividad.setUsuario(usuario);
        actividad.setFecha_creacion(LocalDateTime.now());

        return actividad;
    }

    public void actualizarEntidadDesdeDTO(Actividad actividad, ActividadRequestDTO dto) {
        if (dto == null) return;

        actividad.setTipo(dto.tipo());
        actividad.setDescripcion(dto.descripcion());
        actividad.setVirtual(dto.virtual());
        actividad.setFecha_actividad(dto.fecha_actividad());
    }

    public void marcarResultadoDesdeDTO(Actividad actividad, ActividadCierreRequestDTO dto) {
        if (dto == null) return;

        actividad.setResultado(dto.resultado());
    }

}
