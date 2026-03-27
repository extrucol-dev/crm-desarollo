package com.extrucol.crm.repository;

import com.extrucol.crm.model.Cliente;
import com.extrucol.crm.model.Oportunidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OportunidadRepository extends JpaRepository<Oportunidad, Long> {
    List<Oportunidad> findByClienteId(Long id);
    List<Oportunidad> findByUsuarioEmail(String email);
}
