package com.extrucol.crm.oportunidad.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CRM_ESTADO_OPORTUNIDAD")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class EstadoOportunidad {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "estado_oportunidad_seq")
    @SequenceGenerator(
            name = "estado_oportunidad_seq",
            sequenceName = "CRM_ESTADO_OPORTUNIDAD_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_estado_oportunidad")
    Long id;

    @Column(nullable = false, unique = true)
    String nombre;
}
