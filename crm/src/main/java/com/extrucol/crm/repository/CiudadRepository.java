package com.extrucol.crm.repository;

import com.extrucol.crm.model.catalogo.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CiudadRepository extends JpaRepository<Ciudad,Long> {
}
