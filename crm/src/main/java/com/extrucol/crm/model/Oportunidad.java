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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "oportunidad_seq")
    @SequenceGenerator(
            name = "oportunidad_seq",
            sequenceName = "CRM_OPORTUNIDAD_SEQ",
            allocationSize = 1
    )
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

    @Column
    LocalDate fecha_cierre;

    @Column
    String motivo_cierre;

    @JoinColumn(name = "id_cliente", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Contacto contacto;

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
