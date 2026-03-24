package com.extrucol.crm.controller;

import com.extrucol.crm.dto.request.OportunidadEstadoRequestDTO;
import com.extrucol.crm.dto.request.OportunidadRequestDTO;
import com.extrucol.crm.dto.response.OportunidadResponseDTO;
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
    public ResponseEntity<OportunidadResponseDTO> crearOportunidad( @Validated @RequestBody OportunidadRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(oportunidadService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OportunidadResponseDTO> actualizar(
            @Validated @RequestBody OportunidadRequestDTO dto,
            @PathVariable Long id){
        return ResponseEntity.ok(oportunidadService.actualizar(id,dto));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<OportunidadResponseDTO> actualizarEstado(
            @Validated @RequestBody OportunidadEstadoRequestDTO dto,
            @PathVariable Long id){
        System.out.println(id);
        return ResponseEntity.ok(oportunidadService.actualizarEstado(id,dto));
    }

    @GetMapping
    public ResponseEntity<List<OportunidadResponseDTO>> listar(){
        return ResponseEntity.ok(oportunidadService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OportunidadResponseDTO> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(oportunidadService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        oportunidadService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
