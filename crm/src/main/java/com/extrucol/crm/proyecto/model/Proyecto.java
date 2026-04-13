package com.extrucol.crm.proyecto.model;

import com.extrucol.crm.oportunidad.model.Oportunidad;
import com.extrucol.crm.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "CRM_PROYECTO")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Proyecto {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "proyecto_seq")
    @SequenceGenerator(
            name = "proyecto_seq",
            sequenceName = "CRM_PROYECTO_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_proyecto")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String descripcion;

    @Column(nullable = false)
    String estado;

    @JoinColumn(name = "id_oportunidad", nullable = false)
    @OneToOne(fetch = FetchType.LAZY)
    Oportunidad oportunidad;

    @JoinColumn(name = "id_usuario", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Usuario usuario;

    @Column(nullable = false)
    LocalDateTime fecha_creacion;

    @Column(nullable = false)
    LocalDateTime fecha_actualizacion;

    @PrePersist
    void persistirFecha(){
        fecha_creacion=  LocalDateTime.now();
    }

    @PreUpdate
    void actualizarFecha(){
        fecha_actualizacion=  LocalDateTime.now();
    }
}
