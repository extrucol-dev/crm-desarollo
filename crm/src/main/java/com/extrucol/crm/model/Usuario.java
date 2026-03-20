package com.extrucol.crm.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "CRM_UBICACION")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String email;

    @Column(nullable = false)
    String password;

    @Column(nullable = false)
    String rol;

    @Column(nullable = false)
    Integer activo;

    @Column(nullable = false)
    LocalDate fechaCreacion;
}
