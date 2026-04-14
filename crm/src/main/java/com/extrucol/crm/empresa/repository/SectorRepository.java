package com.extrucol.crm.empresa.repository;

import com.extrucol.crm.empresa.model.catalogo.Sector;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SectorRepository extends JpaRepository<Sector,Long> {
    Optional<Sector> findByCodigo(String codigo);
}
