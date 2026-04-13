package com.extrucol.crm.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

public class Auditoria {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "auditoria_seq")
    @SequenceGenerator(
            name = "auditoria_seq",
            sequenceName = "CRM_AUDITORIA_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_auditoria")
    Long id;

    @JoinColumn(name = "id_usuario", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Usuario usuario;

    @Column(nullable = false)
    String valor_antiguo;

    @Column(nullable = false)
    String valor_nuevo;

    @Column(nullable = false)
    LocalDateTime fecha_registro;

    @PrePersist
    void persistirFecha(){
        fecha_registro=  LocalDateTime.now();
    }

}
