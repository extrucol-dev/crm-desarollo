package com.extrucol.crm.repository;

import com.extrucol.crm.model.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Contacto, Long> {
    Optional<Contacto> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Contacto> findByUsuarioEmail(String email);
}
