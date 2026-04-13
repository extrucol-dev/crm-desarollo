package com.extrucol.crm.proyecto;

import com.extrucol.crm.proyecto.dto.request.ProyectoEstadoRequestDTO;
import com.extrucol.crm.proyecto.dto.request.ProyectoRequestDTO;
import com.extrucol.crm.proyecto.dto.response.ProyectoResponseDTO;
import com.extrucol.crm.proyecto.service.ProyectoService;
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
        return ResponseEntity.ok(proyectoService.listarPorUsuarioActual());
    }

    @GetMapping("/todos")
    public ResponseEntity<List<ProyectoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(proyectoService.listarTodos());
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
