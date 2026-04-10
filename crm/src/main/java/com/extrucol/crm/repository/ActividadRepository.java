package com.extrucol.crm.repository;

import com.extrucol.crm.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    List<Actividad> findByOportunidadId(Long id);

    List<Actividad> findByUsuarioEmail(String email);

    @Query("""
                SELECT a FROM Actividad a
                WHERE (:inicio IS NULL OR a.fecha_actividad >= :inicio)
                AND (:fin IS NULL OR a.fecha_actividad <= :fin)
            """)
    List<Actividad> filtrarPorFecha(LocalDateTime inicio, LocalDateTime fin);

    @Query("""
                SELECT a FROM Actividad a
                WHERE (:inicio IS NULL OR a.fecha_actividad >= :inicio)
                AND (:fin IS NULL OR a.fecha_actividad <= :fin)
                AND a.usuario.email = :email
            """)
    List<Actividad> filtrarPorFechaYUsuario(LocalDateTime inicio, LocalDateTime fin, String email);
}
