package com.extrucol.crm.model.catalogo;

import com.extrucol.crm.model.Cliente;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CRM_TELEFONO")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Telefono {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "telefono_seq")
    @SequenceGenerator(
            name = "telefono_seq",
            sequenceName = "CRM_TELEFONOL_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_telefono")
    Long id;

    @Column(nullable = false)
    String numero;

    @JoinColumn(name = "id_cliente", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Cliente cliente;
}