package com.extrucol.crm.dto.request;

import com.extrucol.crm.model.Usuario;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

public record ClienteRequestDTO(

        String nombre,

        String empresa,

        String sector,

        String ciudad,

        String telefono,

        String email,

        Long usuario

) {
}
