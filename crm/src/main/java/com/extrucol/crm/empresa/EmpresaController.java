package com.extrucol.crm.empresa;

import com.extrucol.crm.empresa.dto.request.EmpresaEstadoRequestDTO;
import com.extrucol.crm.empresa.dto.request.EmpresaRequestDTO;
import com.extrucol.crm.empresa.dto.response.EmpresaResponseDTO;
import com.extrucol.crm.empresa.service.EmpresaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
@Validated
public class EmpresaController {

    private final EmpresaService empresaService;

    /**
     * POST /api/empresas
     * Crea una nueva empresa
     */
    @PostMapping
    public ResponseEntity<EmpresaResponseDTO> crear(@Validated @RequestBody EmpresaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(empresaService.crear(dto));
    }

    /**
     * GET /api/empresas
     * Lista todas las empresas
     */
    @GetMapping
    public ResponseEntity<List<EmpresaResponseDTO>> listar() {
        return ResponseEntity.ok(empresaService.listar());
    }

    /**
     * GET /api/empresas/activas
     * Lista solo las empresas activas
     */
    @GetMapping("/activas")
    public ResponseEntity<List<EmpresaResponseDTO>> listarActivas() {
        return ResponseEntity.ok(empresaService.listarActivas());
    }

    /**
     * GET /api/empresas/{id}
     * Obtiene una empresa por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<EmpresaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.buscarPorId(id));
    }

    /**
     * PUT /api/empresas/{id}
     * Actualiza una empresa existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<EmpresaResponseDTO> actualizar(
            @PathVariable Long id,
            @Validated @RequestBody EmpresaRequestDTO dto) {
        return ResponseEntity.ok(empresaService.actualizar(id, dto));
    }

    /**
     * PATCH /api/empresas/{id}/estado
     * Cambia el estado (activo/inactivo) de una empresa
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable Long id,
            @Validated @RequestBody EmpresaEstadoRequestDTO dto) {
        empresaService.cambiarEstado(id, dto);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * DELETE /api/empresas/{id}
     * Elimina una empresa (solo si no tiene clientes asociados)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        empresaService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
