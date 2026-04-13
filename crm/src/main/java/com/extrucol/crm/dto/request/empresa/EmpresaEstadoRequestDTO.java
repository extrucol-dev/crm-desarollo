package com.extrucol.crm.dto.request.empresa;

import jakarta.validation.constraints.NotNull;

public record EmpresaEstadoRequestDTO(

        @NotNull(message = "El estado es obligatorio")
        Boolean activo

) {
}
