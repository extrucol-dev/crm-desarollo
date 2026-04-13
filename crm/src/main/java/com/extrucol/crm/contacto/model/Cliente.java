package com.extrucol.crm.contacto.model;

import com.extrucol.crm.contacto.model.catalogo.Email;
import com.extrucol.crm.contacto.model.catalogo.Telefono;
import com.extrucol.crm.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "CRM_CLIENTE")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cliente_seq")
    @SequenceGenerator(
            name = "cliente_seq",
            sequenceName = "CRM_CLIENTE_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_cliente")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String empresa;

    @Column(nullable = false)
    String sector;

    @JoinColumn(name = "id_telefono", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Telefono telefono;

    @JoinColumn(name = "id_email", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Email email;

    @JoinColumn(name = "id_usuario", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Usuario usuario;

    @Column(nullable = false)
    LocalDateTime fecha_creacion;

    @PrePersist
    void persistirFecha() {
        fecha_creacion = LocalDateTime.now();
    }

}
