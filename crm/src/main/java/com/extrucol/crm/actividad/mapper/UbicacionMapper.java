package com.extrucol.crm.actividad.mapper;

import com.extrucol.crm.actividad.dto.request.ActividadCierreRequestDTO;
import com.extrucol.crm.actividad.dto.response.UbicacionResponseDTO;
import com.extrucol.crm.actividad.model.Actividad;
import com.extrucol.crm.actividad.model.Ubicacion;
import org.springframework.stereotype.Component;

@Component
public class UbicacionMapper {

    public UbicacionResponseDTO entidadADTO(Ubicacion ubicacion) {
        if (ubicacion == null) return null;

        return new UbicacionResponseDTO(
                ubicacion.getLongitud(),
                ubicacion.getLatitud()

        );
    }

    public Ubicacion crearEntidad(ActividadCierreRequestDTO dto, Actividad actividad) {
        if (dto == null) return null;

        Ubicacion ubicacion = new Ubicacion();

        ubicacion.setLatitud(dto.latitud());
        ubicacion.setLongitud(dto.longitud());
        ubicacion.setActividad(actividad);
        return ubicacion;
    }
}
