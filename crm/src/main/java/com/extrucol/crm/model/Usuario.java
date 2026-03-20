package com.extrucol.crm.model;


import com.extrucol.crm.enums.RolUsuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "CRM_USUARIO")
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
    RolUsuario rol;

    @Column(nullable = false)
    Boolean activo;

    @Column(nullable = false)
    LocalDateTime fecha_creacion;
}
