package com.extrucol.crm.empresa.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EmpresaRequestDTO(
        @NotBlank(message = "El nombre de la empresa es obligatorio")
        @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
        String nombre,

        @NotBlank(message = "La dirección es obligatoria")
        @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
        String direccion,

        @NotNull(message = "El municipio es obligatorio")
        Long municipio_id,

        @NotNull(message = "El tipo de documento es obligatorio")
        Long tipo_documento_id,

        @NotBlank(message = "El número de documento es obligatorio")
        @Size(min = 6, max = 20, message = "El número de documento debe tener entre 6 y 20 caracteres")
        String no_documento,

        @NotNull(message = "El sector es obligatorio")
        Long sector_id,

        @NotNull(message = "La modalidad es obligatoria")
        Long modalidad_id
) {
}
