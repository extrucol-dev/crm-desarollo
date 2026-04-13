package com.extrucol.crm.model;

import com.extrucol.crm.model.catalogo.Documento;
import com.extrucol.crm.model.catalogo.Modalidad;
import com.extrucol.crm.model.catalogo.Municipio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

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

    @JoinColumn(name = "id_municipio", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Municipio municipio;

    @JoinColumn(name = "id_documento", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Documento tipo_documento;

    @Column(nullable = false)
    String no_documento;

    @JoinColumn(name = "id_modalidad", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Modalidad modalidad;

    @Column(nullable = false)
    boolean activo;

    @PrePersist
    void persistirActivo() {
        activo = true;
    }
    @Column(nullable = false)
    boolean nuevo;

    @PrePersist
    void persistirNuevo() {
        nuevo = true;
    }

    @Column(nullable = false)
    LocalDateTime fecha_creacion;

    @PrePersist
    void persistirFecha() {
        fecha_creacion = LocalDateTime.now();
    }


}
