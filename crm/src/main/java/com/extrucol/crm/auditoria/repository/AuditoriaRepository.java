package com.extrucol.crm.auditoria.repository;

import com.extrucol.crm.auditoria.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {

    @Query("SELECT a FROM Auditoria a JOIN FETCH a.usuario ORDER BY a.fecha_registro DESC")
    List<Auditoria> findAllWithUsuario();

    @Query("SELECT a FROM Auditoria a JOIN FETCH a.usuario WHERE a.usuario.id = :usuarioId ORDER BY a.fecha_registro DESC")
    List<Auditoria> findByUsuarioIdOrderByFechaRegistroDesc(@Param("usuarioId") Long usuarioId);
}
