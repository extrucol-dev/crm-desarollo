package com.extrucol.crm.repository;

import com.extrucol.crm.model.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {
    Optional<Ubicacion> findByActividadId(Long id);
}

