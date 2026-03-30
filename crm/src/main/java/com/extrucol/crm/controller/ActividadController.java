package com.extrucol.crm.controller;

import com.extrucol.crm.dto.request.actividad.ActividadCierreRequestDTO;
import com.extrucol.crm.dto.request.actividad.ActividadRequestDTO;
import com.extrucol.crm.dto.response.actividad.ActividadResponseDTO;
import com.extrucol.crm.dto.response.actividad.ActividadUbicacionResponseDTO;
import com.extrucol.crm.service.ActividadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/actividades")
@RequiredArgsConstructor
public class ActividadController {

    private final ActividadService actividadService;

    //endpoint de creacion de actividad
    @PostMapping
    public ResponseEntity<ActividadResponseDTO> crearActividad(@Validated @RequestBody ActividadRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(actividadService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActividadResponseDTO> actualizar(@Validated @RequestBody ActividadRequestDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(actividadService.actualizar(id, dto));
    }


    @PutMapping("/{id}/cierre")
    public ResponseEntity<ActividadUbicacionResponseDTO> cerrar(@Validated @RequestBody ActividadCierreRequestDTO dto, @PathVariable Long id) {

        return ResponseEntity.ok(actividadService.cerrarActividad(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<ActividadResponseDTO>> listar(
            @RequestParam(required = false) LocalDate inicio,
            @RequestParam(required = false) LocalDate fin) {

        return ResponseEntity.ok(actividadService.listar(inicio, fin));
    }

    @GetMapping("/todas")
    public ResponseEntity<List<ActividadResponseDTO>> listarTodas(
            @RequestParam(required = false) LocalDate inicio,
            @RequestParam(required = false) LocalDate fin) {

        return ResponseEntity.ok(actividadService.listarTodas(inicio, fin));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActividadResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(actividadService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        actividadService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
