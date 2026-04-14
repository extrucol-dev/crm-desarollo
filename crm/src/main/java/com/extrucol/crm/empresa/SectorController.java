package com.extrucol.crm.empresa;

import com.extrucol.crm.empresa.dto.response.SectorResponseDTO;
import com.extrucol.crm.empresa.service.SectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sectores")
@RequiredArgsConstructor
public class SectorController {

    private final SectorService sectorService;

    /**
     * GET /api/sectores
     * Lista todos los sectores disponibles
     */
    @GetMapping
    public ResponseEntity<List<SectorResponseDTO>> listar() {
        return ResponseEntity.ok(sectorService.listar());
    }

    /**
     * GET /api/sectores/{id}
     * Obtiene un sector por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<SectorResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(sectorService.buscarPorId(id));
    }

    /**
     * GET /api/sectores/codigo/{codigo}
     * Obtiene un sector por código (búsqueda alternativa)
     * Ejemplo: /api/sectores/codigo/MFG
     */
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<SectorResponseDTO> buscarPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(sectorService.buscarPorCodigo(codigo));
    }
}
