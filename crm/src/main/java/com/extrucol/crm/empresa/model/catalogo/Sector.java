package com.extrucol.crm.empresa.model.catalogo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CRM_SECTOR")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sector_seq")
    @SequenceGenerator(
            name = "sector_seq",
            sequenceName = "CRM_SECTOR_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_sector")
    Long id;

    @Column(nullable = false, unique = true)
    String nombre;

    @Column(nullable = false, unique = true)
    String codigo;
}
