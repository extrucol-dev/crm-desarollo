package com.extrucol.crm.empresa.dto.request;

import jakarta.validation.constraints.NotNull;

public record EmpresaEstadoRequestDTO(

        @NotNull(message = "El estado es obligatorio")
        Boolean activo

) {
}
