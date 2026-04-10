package com.extrucol.crm.model;

import com.extrucol.crm.model.catalogo.Documento;
import com.extrucol.crm.model.catalogo.Municipio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CRM_EMPRESA")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "empresa_seq")
    @SequenceGenerator(
            name = "empresa_seq",
            sequenceName = "CRM_EMPRESA_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_empresa")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String direccion;

    @JoinColumn(name = "id_municipio")
    @ManyToOne(fetch = FetchType.LAZY)
    Municipio municipio;

    @JoinColumn(name = "id_documento")
    @ManyToOne(fetch = FetchType.LAZY)
    Documento documento;


}
