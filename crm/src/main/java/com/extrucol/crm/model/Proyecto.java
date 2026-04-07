package com.extrucol.crm.model;

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

    @JoinColumn(name = "id_oportunidad")
    @OneToOne(fetch = FetchType.LAZY)
    Oportunidad oportunidad;

    @JoinColumn(name = "id_usuario")
    @ManyToOne(fetch = FetchType.LAZY)
    Usuario usuario;

    @Column(nullable = false)
    LocalDateTime fecha_creacion;

    @Column(nullable = false)
    LocalDateTime fecha_actualizacion;
}
