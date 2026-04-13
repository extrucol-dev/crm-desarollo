package com.extrucol.crm.model.catalogo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "CRM_MODALIDAD")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Modalidad {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "modalidad_seq")
    @SequenceGenerator(
            name = "modalidad_seq",
            sequenceName = "CRM_MODALIDAD_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_modalidad")
    Long id;

    @Column(nullable = false)
    String tipo;

    @Column(nullable = false)
    String codigo;
}
