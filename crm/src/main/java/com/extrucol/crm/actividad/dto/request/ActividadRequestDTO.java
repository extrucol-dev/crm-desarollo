package com.extrucol.crm.actividad.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record ActividadRequestDTO(

        @NotBlank(message = "El tipo de actividad es obligatorio")
        String tipo,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(min = 10, max = 500, message = "La descripción debe tener entre 10 y 500 caracteres")
        String descripcion,

        @NotNull(message = "Debe indicar si la actividad es virtual o presencial")
        Boolean virtual,

        @NotNull(message = "La fecha de la actividad es obligatoria")
        LocalDateTime fecha_actividad,

        @NotNull(message = "La oportunidad es obligatoria")
        @Positive(message = "El id de la oportunidad debe ser positivo")
        Long oportunidad
) {
}
