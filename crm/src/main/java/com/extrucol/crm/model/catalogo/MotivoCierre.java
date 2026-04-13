package com.extrucol.crm.model.catalogo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "CRM_MOTIVO_CIERRE")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MotivoCierre {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "motivo_cierre_seq")
    @SequenceGenerator(
            name = "motivo_cierre_seq",
            sequenceName = "CRM_MOTIVO_CIERRE_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_motivo_cierre")
    Long id;

    @Column(nullable = false)
    String motivo;

}
