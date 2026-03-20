package com.extrucol.crm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "CRM_OPORTUNIDAD")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Oportunidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_oportunidad")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String descripcion;

    @Column(nullable = false)
    String tipo;

    @Column(nullable = false)
    String estado;

    @Column(nullable = false)
    BigDecimal valor_estimado;

    @Column(nullable = false)
    LocalDate fecha_cierre;

    @Column(nullable = false)
    String motivo_cierre;

    @JoinColumn(name = "id_cliente")
    @OneToOne(fetch = FetchType.LAZY)
    Cliente cliente;

    @JoinColumn(name = "id_usuario")
    @OneToOne(fetch = FetchType.LAZY)
    Usuario usuario;

    @Column(nullable = false)
    LocalDateTime fecha_creacion;

    @Column(nullable = false)
    LocalDateTime fecha_actualizacion;

}
