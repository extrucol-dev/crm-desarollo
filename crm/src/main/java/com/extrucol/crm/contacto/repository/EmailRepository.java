package com.extrucol.crm.contacto.repository;

import com.extrucol.crm.contacto.model.catalogo.Email;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailRepository extends JpaRepository<Email,Long> {
}
