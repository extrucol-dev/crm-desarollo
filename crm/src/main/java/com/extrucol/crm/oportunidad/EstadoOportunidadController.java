package com.extrucol.crm.oportunidad;

import com.extrucol.crm.oportunidad.dto.request.EstadoOportunidadRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.EstadoOportunidadResponseDTO;
import com.extrucol.crm.oportunidad.service.EstadoOportunidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estados-oportunidad")
@RequiredArgsConstructor
public class EstadoOportunidadController {

    private final EstadoOportunidadService estadoService;

    @GetMapping
    public ResponseEntity<List<EstadoOportunidadResponseDTO>> listar() {
        return ResponseEntity.ok(estadoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadoOportunidadResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(estadoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<EstadoOportunidadResponseDTO> crear(@Validated @RequestBody EstadoOportunidadRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(estadoService.crear(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        estadoService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
