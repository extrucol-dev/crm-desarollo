package com.extrucol.crm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "CRM_UBICACION")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Ubicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ubicacion_seq")
    @SequenceGenerator(
            name = "ubicacion_seq",
            sequenceName = "CRM_UBICACION_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_ubicacion")
    Long id;

    @Column(nullable = false)
    BigDecimal latitud;

    @Column(nullable = false)
    BigDecimal longitud;

    @JoinColumn(name = "id_actividad")
    @OneToOne(fetch = FetchType.LAZY)
    Actividad actividad;
}
