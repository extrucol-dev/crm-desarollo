package com.extrucol.crm.empresa.repository;

import com.extrucol.crm.empresa.model.catalogo.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentoRepository extends JpaRepository<Documento,Long> {
}
