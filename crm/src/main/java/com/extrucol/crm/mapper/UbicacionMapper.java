package com.extrucol.crm.mapper;

import com.extrucol.crm.dto.request.actividad.ActividadCierreRequestDTO;
import com.extrucol.crm.dto.response.UbicacionResponseDTO;
import com.extrucol.crm.model.Actividad;
import com.extrucol.crm.model.Ubicacion;
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
