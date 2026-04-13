package com.extrucol.crm.model.catalogo;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CRM_CIUDAD")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Ciudad {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ciudad_seq")
    @SequenceGenerator(
            name = "ciudad_seq",
            sequenceName = "CRM_CIUDAD_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_ciudad")
    Long id;

    @Column
    String nombre;
}
