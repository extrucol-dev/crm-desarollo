package com.extrucol.crm.mapper;

import com.extrucol.crm.dto.request.OportunidadEstadoRequestDTO;
import com.extrucol.crm.dto.request.OportunidadRequestDTO;
import com.extrucol.crm.dto.response.OportunidadResponseDTO;
import com.extrucol.crm.model.Cliente;
import com.extrucol.crm.model.Oportunidad;
import com.extrucol.crm.model.Usuario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class OportunidadMapper {

    public OportunidadResponseDTO entidadADTO(Oportunidad oportunidad){
        if(oportunidad == null) return null;

        return new OportunidadResponseDTO(

                oportunidad.getNombre(),
                oportunidad.getDescripcion(),
                oportunidad.getTipo(),
                oportunidad.getEstado(),
                oportunidad.getValor_estimado(),
                oportunidad.getFecha_cierre(),
                oportunidad.getMotivo_cierre(),
                oportunidad.getCliente(),
                oportunidad.getUsuario()

        );
    }

    public Oportunidad DTOAEntidad(OportunidadRequestDTO dto, Cliente cliente, Usuario usuario) {
        if(dto == null) return null;

        Oportunidad oportunidad = new Oportunidad();
                oportunidad.setNombre(dto.nombre());
                oportunidad.setDescripcion(dto.descripcion());
                oportunidad.setTipo(dto.tipo());
                oportunidad.setEstado(dto.estado());
                oportunidad.setValor_estimado(dto.valor_estimado());
                oportunidad.setFecha_cierre(dto.fecha_cierre());
                oportunidad.setMotivo_cierre(dto.motivo_cierre());
                oportunidad.setCliente(cliente);
                oportunidad.setUsuario(usuario);
                oportunidad.setFecha_actualizacion(LocalDateTime.now());

        return oportunidad;
    }

    public Oportunidad crearDTOAEntidad(OportunidadRequestDTO dto, Cliente cliente, Usuario usuario) {
        if(dto == null) return null;

        Oportunidad oportunidad = new Oportunidad();
        oportunidad.setNombre(dto.nombre());
        oportunidad.setDescripcion(dto.descripcion());
        oportunidad.setTipo(dto.tipo());
        oportunidad.setEstado(dto.estado());
        oportunidad.setValor_estimado(dto.valor_estimado());
        oportunidad.setFecha_cierre(dto.fecha_cierre());
        oportunidad.setMotivo_cierre(dto.motivo_cierre());
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
        oportunidad.setMotivo_cierre(dto.motivo_cierre());
    }

    public void actualizarEstadoDesdeDTO(Oportunidad oportunidad, OportunidadEstadoRequestDTO dto){
        if(dto == null) return;

        oportunidad.setEstado(dto.estado());
    }
}
