package com.extrucol.crm.empresa.model;

import com.extrucol.crm.empresa.model.catalogo.Documento;
import com.extrucol.crm.empresa.model.catalogo.Modalidad;
import com.extrucol.crm.empresa.model.catalogo.Municipio;
import com.extrucol.crm.empresa.model.catalogo.Sector;
import com.extrucol.crm.contacto.model.Cliente;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CRM_EMPRESA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    Documento tipoDocumento;

    @Column(nullable = false)
    String noDocumento;

    @JoinColumn(name = "id_sector", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Sector sector;

    @JoinColumn(name = "id_modalidad", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Modalidad modalidad;

    @Column(nullable = false)
    boolean activo;

    @Column(nullable = false)
    boolean nuevo;

    @Column(nullable = false)
    LocalDateTime fecha_creacion;

    @OneToMany(mappedBy = "empresa", fetch = FetchType.LAZY)
    List<Cliente> clientes = new ArrayList<>();

    @PrePersist
    void persistirFecha() {
        nuevo = true;
        activo = true;
        fecha_creacion = LocalDateTime.now();
    }
}
