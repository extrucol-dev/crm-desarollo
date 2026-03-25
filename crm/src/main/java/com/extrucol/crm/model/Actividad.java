package com.extrucol.crm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "CRM_ACTIVIDAD")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_actividad")
    Long id;

    @Column(nullable = false)
    String tipo;

    @Column(nullable = false)
    String descripcion;

    @Column(nullable = false)
    String resultado;

    @Column(nullable = false)
    Boolean virtual;

    @Column(nullable = false)
    LocalDateTime fecha_actividad;

    @JoinColumn
    @OneToOne(fetch = FetchType.LAZY)
    Oportunidad oportunidad;

    @JoinColumn(name = "id_usuario")
    @OneToOne(fetch = FetchType.LAZY)
    Usuario usuario;

    @Column(nullable = false)
    LocalDateTime fecha_creacion;

}
