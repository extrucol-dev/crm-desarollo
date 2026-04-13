package com.extrucol.crm.dto.request.empresa;

public record EmpresaRequestDTO(

        String nombre,

        String direccion,

        Long municipio,

        Long tipo_documento,

        String no_documento,

        Long ciudad,

        Long modalidad
) {
}
