package com.extrucol.crm.oportunidad.repository;

import com.extrucol.crm.oportunidad.model.EstadoOportunidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoOportunidadRepository extends JpaRepository<EstadoOportunidad, Long> {

    Optional<EstadoOportunidad> findByNombre(String nombre);
}
