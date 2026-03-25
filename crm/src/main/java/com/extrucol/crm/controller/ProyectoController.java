package com.extrucol.crm.controller;

import com.extrucol.crm.dto.request.proyecto.ProyectoEstadoRequestDTO;
import com.extrucol.crm.dto.request.proyecto.ProyectoRequestDTO;
import com.extrucol.crm.dto.response.ProyectoResponseDTO;
import com.extrucol.crm.service.ProyectoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
@RequiredArgsConstructor
public class ProyectoController {

    private final ProyectoService proyectoService;

    //endpoint de creacion de proyecto
    @PostMapping
    public ResponseEntity<ProyectoResponseDTO> crearProyecto(@Validated @RequestBody ProyectoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(proyectoService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProyectoResponseDTO> actualizar(@Validated @RequestBody ProyectoRequestDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(proyectoService.actualizar(id, dto));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<ProyectoResponseDTO> actualizarEstado(@Validated @RequestBody ProyectoEstadoRequestDTO dto, @PathVariable Long id) {

        return ResponseEntity.ok(proyectoService.actualizarEstado(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<ProyectoResponseDTO>> listar() {
        return ResponseEntity.ok(proyectoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProyectoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(proyectoService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        proyectoService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
