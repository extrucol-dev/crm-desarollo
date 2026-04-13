package com.extrucol.crm.actividad.model;

import com.extrucol.crm.oportunidad.model.Oportunidad;
import com.extrucol.crm.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "CRM_ACTIVIDAD")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "actividad_seq")
    @SequenceGenerator(
            name = "actividad_seq",
            sequenceName = "CRM_ACTIVIDAD_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_actividad")
    Long id;

    @Column(nullable = false)
    String tipo;

    @Column(nullable = false)
    String descripcion;

    @Column
    String resultado;

    @Column(nullable = false)
    Boolean virtual;

    @Column(nullable = false)
    LocalDateTime fecha_actividad;

    @JoinColumn(name = "id_oportunidad", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Oportunidad oportunidad;

    @JoinColumn(name = "id_usuario", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Usuario usuario;

    @Column(nullable = false)
    LocalDateTime fecha_creacion;

    @PrePersist
    void persistirFecha(){
        fecha_creacion=  LocalDateTime.now();
    }

}
