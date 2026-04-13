package com.extrucol.crm.model.catalogo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "CRM_MONTO_MINIMO")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MontoMinimo {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "monto_minimo_seq")
    @SequenceGenerator(
            name = "monto_minimo_seq",
            sequenceName = "CRM_MONTO_MINIMO_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_monto_minimo")
    Long id;

    @Column(nullable = false)
    BigDecimal monto;

}
