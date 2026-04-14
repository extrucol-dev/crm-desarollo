package com.extrucol.crm.empresa.repository;

import com.extrucol.crm.empresa.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    boolean existsBynoDocumento(String no_documento);
    List<Empresa> findByActivoTrue();
    Optional<Empresa> findByIdAndActivoTrue(Long id);

}