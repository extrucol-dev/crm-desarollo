package com.extrucol.crm.repository;

import com.extrucol.crm.model.Actividad;
import com.extrucol.crm.model.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {
}

