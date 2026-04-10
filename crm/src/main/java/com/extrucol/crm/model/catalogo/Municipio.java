package com.extrucol.crm.model.catalogo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CRM_MUNICIPIO")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Municipio {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "municipio_seq")
    @SequenceGenerator(
            name = "municipio_seq",
            sequenceName = "CRM_MUNICIPIO_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_municipio")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String codigo;

    @JoinColumn(name = "id_departamento")
    @ManyToOne(fetch = FetchType.LAZY)
    Departamento departamento;
}
