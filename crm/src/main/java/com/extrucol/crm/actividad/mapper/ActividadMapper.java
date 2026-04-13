package com.extrucol.crm.actividad.mapper;


import com.extrucol.crm.actividad.model.Actividad;
import com.extrucol.crm.actividad.model.Ubicacion;
import com.extrucol.crm.actividad.dto.request.ActividadCierreRequestDTO;
import com.extrucol.crm.actividad.dto.request.ActividadRequestDTO;
import com.extrucol.crm.actividad.dto.response.ActividadResponseDTO;
import com.extrucol.crm.actividad.dto.response.ActividadSimpleResposeDTO;
import com.extrucol.crm.actividad.dto.response.ActividadUbicacionResponseDTO;
import com.extrucol.crm.oportunidad.mapper.OportunidadMapper;
import com.extrucol.crm.oportunidad.model.Oportunidad;
import com.extrucol.crm.usuario.mapper.UsuarioMapper;
import com.extrucol.crm.usuario.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class ActividadMapper {
    private final UbicacionMapper ubicacionMapper;
    private final OportunidadMapper oportunidadMapper;
    private final UsuarioMapper usuarioMapper;

    public ActividadResponseDTO entidadADTO(Actividad actividad) {
        if (actividad == null) return null;

        return new ActividadResponseDTO(actividad.getId(), actividad.getTipo(), actividad.getDescripcion(), actividad.getResultado(), actividad.getVirtual(), actividad.getFecha_actividad(), usuarioMapper.entidadADTO(actividad.getUsuario()), oportunidadMapper.entidadADTOSimple(actividad.getOportunidad()));
    }

    public ActividadSimpleResposeDTO entidadADTOSimple(Actividad actividad) {
        if (actividad == null) return null;

        return new ActividadSimpleResposeDTO(actividad.getId(), actividad.getTipo(), actividad.getDescripcion(), actividad.getResultado(), actividad.getVirtual(), actividad.getFecha_actividad());
    }

    public ActividadUbicacionResponseDTO entidadADTOUbicacion(Actividad actividad, Ubicacion ubicacion) {
        if (actividad == null) return null;

        return new ActividadUbicacionResponseDTO(actividad.getId(), actividad.getTipo(), actividad.getDescripcion(), actividad.getResultado(), actividad.getVirtual(), actividad.getFecha_actividad(), ubicacionMapper.entidadADTO(ubicacion), usuarioMapper.entidadADTO(actividad.getUsuario()), oportunidadMapper.entidadADTOSimple(actividad.getOportunidad())

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
