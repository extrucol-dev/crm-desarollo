package com.extrucol.crm.contacto.model.catalogo;

import com.extrucol.crm.contacto.model.Cliente;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CRM_EMAIL")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Email {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "email_seq")
    @SequenceGenerator(
            name = "email_seq",
            sequenceName = "CRM_EMAIL_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_email")
    Long id;

    @Column(nullable = false)
    String email;

    @JoinColumn(name = "id_cliente", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    Cliente cliente;
}
