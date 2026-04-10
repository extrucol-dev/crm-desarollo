package com.extrucol.crm.model.catalogo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CRM_DEPARTAMENTO")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "departamento_seq")
    @SequenceGenerator(
            name = "departamento_seq",
            sequenceName = "CRM_DEPARTAMENTO_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_departamento")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String codigo;

    @JoinColumn(name = "id_pais")
    @ManyToOne(fetch = FetchType.LAZY)
    Pais pais;
}
