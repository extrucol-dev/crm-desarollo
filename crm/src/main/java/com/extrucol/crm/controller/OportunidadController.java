package com.extrucol.crm.controller;

import com.extrucol.crm.dto.request.oportunidad.OportunidadCierreRequestDTO;
import com.extrucol.crm.dto.request.oportunidad.OportunidadEstadoRequestDTO;
import com.extrucol.crm.dto.request.oportunidad.OportunidadRequestDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadActividadesResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadDetalleResponseDTO;
import com.extrucol.crm.dto.response.oportunidad.OportunidadResponseDTO;
import com.extrucol.crm.service.OportunidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oportunidades")
@RequiredArgsConstructor
public class OportunidadController {

    private final OportunidadService oportunidadService;

    //endpoint de creacion de oportunidad
    @PostMapping
    public ResponseEntity<OportunidadResponseDTO> crearOportunidad(@Validated @RequestBody OportunidadRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(oportunidadService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OportunidadResponseDTO> actualizar(@Validated @RequestBody OportunidadRequestDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(oportunidadService.actualizar(id, dto));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<OportunidadResponseDTO> actualizarEstado(@Validated @RequestBody OportunidadEstadoRequestDTO dto, @PathVariable Long id) {

        return ResponseEntity.ok(oportunidadService.actualizarEstado(id, dto));
    }

    @PutMapping("/{id}/cierre")
    public ResponseEntity<OportunidadResponseDTO> cerrar(@Validated @RequestBody OportunidadCierreRequestDTO dto, @PathVariable Long id) {

        return ResponseEntity.ok(oportunidadService.cerrarOportunidad(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<OportunidadResponseDTO>> listar() {
        return ResponseEntity.ok(oportunidadService.listarPorUsuarioActual()); // solo del usuario
    }

    @GetMapping("/todas")
    public ResponseEntity<List<OportunidadResponseDTO>> listarTodas() {
        return ResponseEntity.ok(oportunidadService.listarTodas()); // todas sin filtro
    }

    @GetMapping("/{id}/actividades")
    public ResponseEntity<OportunidadActividadesResponseDTO> buscarPorIdUsuarioActual(@PathVariable Long id) {
        return ResponseEntity.ok(oportunidadService.buscarPorIdUsuarioActual(id));
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<OportunidadDetalleResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(oportunidadService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        oportunidadService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
