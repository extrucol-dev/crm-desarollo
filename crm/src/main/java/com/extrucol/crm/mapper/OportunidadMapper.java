package com.extrucol.crm.mapper;

import com.extrucol.crm.dto.request.oportunidad.OportunidadCierreRequestDTO;
import com.extrucol.crm.dto.request.oportunidad.OportunidadEstadoRequestDTO;
import com.extrucol.crm.dto.request.oportunidad.OportunidadRequestDTO;
import com.extrucol.crm.dto.response.actividad.ActividadResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadActividadesResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadDetalleResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadSimpleResponseDTO;
import com.extrucol.crm.model.Actividad;
import com.extrucol.crm.model.Cliente;
import com.extrucol.crm.model.Oportunidad;
import com.extrucol.crm.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OportunidadMapper {
    private final UsuarioMapper usuarioMapper;
    private final ClienteMapper clienteMapper;

    public OportunidadResponseDTO entidadADTO(Oportunidad oportunidad){
        if(oportunidad == null) return null;

        return new OportunidadResponseDTO(
                oportunidad.getId(),
                oportunidad.getNombre(),
                oportunidad.getDescripcion(),
                oportunidad.getTipo(),
                oportunidad.getEstado(),
                oportunidad.getValor_estimado(),
                oportunidad.getFecha_cierre(),
                oportunidad.getMotivo_cierre(),
                clienteMapper.entidadADTO(oportunidad.getCliente()),
                usuarioMapper.entidadADTO(oportunidad.getUsuario())

        );
    }

    public OportunidadSimpleResponseDTO entidadADTOSimple(Oportunidad oportunidad){
        if(oportunidad == null) return null;

        return new OportunidadSimpleResponseDTO(
                oportunidad.getId(),
                oportunidad.getNombre(),
                oportunidad.getDescripcion(),
                oportunidad.getTipo(),
                oportunidad.getEstado(),
                oportunidad.getValor_estimado(),
                oportunidad.getFecha_cierre(),
                oportunidad.getMotivo_cierre()


        );
    }

    public OportunidadActividadesResponseDTO entidadADTOActividades(Oportunidad oportunidad, List<ActividadResponseDTO> actividades){
        if(oportunidad == null) return null;

        return new OportunidadActividadesResponseDTO(
                oportunidad.getId(),
                oportunidad.getNombre(),
                oportunidad.getDescripcion(),
                oportunidad.getTipo(),
                oportunidad.getEstado(),
                oportunidad.getValor_estimado(),
                oportunidad.getFecha_cierre(),
                oportunidad.getMotivo_cierre(),
                clienteMapper.entidadADTO(oportunidad.getCliente()),
                actividades


        );
    }

    public OportunidadDetalleResponseDTO entidadADTODetalles(Oportunidad oportunidad, List<ActividadResponseDTO> actividades){
        if(oportunidad == null) return null;

        return new OportunidadDetalleResponseDTO(
                oportunidad.getId(),
                oportunidad.getNombre(),
                oportunidad.getDescripcion(),
                oportunidad.getTipo(),
                oportunidad.getEstado(),
                oportunidad.getValor_estimado(),
                oportunidad.getFecha_cierre(),
                oportunidad.getMotivo_cierre(),
                clienteMapper.entidadADTO(oportunidad.getCliente()),
                usuarioMapper.entidadADTO(oportunidad.getUsuario()),
                actividades


        );
    }


    public Oportunidad crearDTOAEntidad(OportunidadRequestDTO dto, Cliente cliente, Usuario usuario) {
        if(dto == null) return null;

        Oportunidad oportunidad = new Oportunidad();
        oportunidad.setNombre(dto.nombre());
        oportunidad.setDescripcion(dto.descripcion());
        oportunidad.setTipo(dto.tipo());
        oportunidad.setEstado("PROSPECTO");
        oportunidad.setValor_estimado(dto.valor_estimado());
        oportunidad.setFecha_cierre(dto.fecha_cierre());
        oportunidad.setCliente(cliente);
        oportunidad.setUsuario(usuario);
        oportunidad.setFecha_actualizacion(LocalDateTime.now());
        oportunidad.setFecha_creacion(LocalDateTime.now());

        return oportunidad;
    }

    public void actualizarEntidadDesdeDTO(Oportunidad oportunidad, OportunidadRequestDTO dto){
        if(dto == null) return;

        oportunidad.setNombre(dto.nombre());
        oportunidad.setDescripcion(dto.descripcion());
        oportunidad.setTipo(dto.tipo());
        oportunidad.setEstado(dto.estado());
        oportunidad.setValor_estimado(dto.valor_estimado());
        oportunidad.setFecha_cierre(dto.fecha_cierre());
    }

    public void actualizarEstadoDesdeDTO(Oportunidad oportunidad, OportunidadEstadoRequestDTO dto){
        if(dto == null) return;

        oportunidad.setEstado(dto.estado());
    }

    public void cierreDesdeDTO(Oportunidad oportunidad, OportunidadCierreRequestDTO dto){
        if(dto == null) return;

        oportunidad.setEstado(dto.estado());
        oportunidad.setFecha_cierre(dto.fecha_cierre());
        oportunidad.setMotivo_cierre(dto.motivo_cierre());
    }
}
