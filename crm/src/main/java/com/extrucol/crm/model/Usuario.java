package com.extrucol.crm.model;


import com.extrucol.crm.enums.RolUsuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "CRM_USUARIO")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Usuario  implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "usuario_seq")
    @SequenceGenerator(
            name = "usuario_seq",
            sequenceName = "CRM_USUARIO_SEQ",
            allocationSize = 1
    )
    @Column(name = "id_usuario")
    Long id;

    @Column(nullable = false)
    String nombre;

    @Column(nullable = false)
    String email;

    @Column(nullable = false)
    String password;

    @Column(nullable = false)
    RolUsuario rol;

    @Column(nullable = false)
    Boolean activo;

    @Column(nullable = false)
    LocalDateTime fecha_creacion;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(rol.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }
}
