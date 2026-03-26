package com.extrucol.crm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "CRM_CLIENTE")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String empresa;
    
    @Column(nullable = false)
    String sector;

    @Column(nullable = false)
    String ciudad;

    @Column(nullable = false)
    String telefono;

    @Column(nullable = false)
    String email;

    @JoinColumn(name = "id_usuario")
    @ManyToOne(fetch = FetchType.LAZY)
    Usuario usuario;

    @Column(nullable = false)
    LocalDateTime fecha_creacion;

}
