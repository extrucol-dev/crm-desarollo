package com.extrucol.crm.model.catalogo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "CRM_DOCUMENTO")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "documento_seq")
    @SequenceGenerator(
            name = "documento_seq",
            sequenceName = "CRM_DOCUMENTO_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_documento")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String codigo;

}
