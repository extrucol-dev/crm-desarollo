package com.extrucol.crm.empresa.model.catalogo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "CRM_PAIS")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Pais {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pais_seq")
    @SequenceGenerator(
            name = "pais_seq",
            sequenceName = "CRM_PAIS_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_pais")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String codigo;

}
