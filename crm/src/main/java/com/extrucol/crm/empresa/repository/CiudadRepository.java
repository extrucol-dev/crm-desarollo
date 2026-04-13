package com.extrucol.crm.empresa.repository;

import com.extrucol.crm.empresa.model.catalogo.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CiudadRepository extends JpaRepository<Ciudad,Long> {
}
