package com.extrucol.crm.contacto.repository;

import com.extrucol.crm.contacto.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByUsuarioEmail(String email);
}
