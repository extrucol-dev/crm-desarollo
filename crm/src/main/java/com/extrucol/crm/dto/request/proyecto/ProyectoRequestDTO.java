package com.extrucol.crm.dto.request.proyecto;

import jakarta.validation.constraints.*;

public record ProyectoRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 3, max = 150, message = "El nombre debe tener entre 3 y 150 caracteres")
        String nombre,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(min = 10, max = 500, message = "La descripción debe tener entre 10 y 500 caracteres")
        String descripcion,

        @NotBlank(message = "El estado es obligatorio")
        String estado,

        @NotNull(message = "La oportunidad es obligatoria")
        @Positive(message = "El id de la oportunidad debe ser positivo")
        Long oportunidad

) {
}