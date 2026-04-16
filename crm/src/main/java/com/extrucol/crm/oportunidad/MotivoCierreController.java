package com.extrucol.crm.oportunidad;

import com.extrucol.crm.oportunidad.dto.request.MotivoCierreRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.MotivoCierreResponseDTO;
import com.extrucol.crm.oportunidad.service.MotivoCierreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motivos-cierre")
@RequiredArgsConstructor
public class MotivoCierreController {

    private final MotivoCierreService motivoCierreService;

    @GetMapping
    public ResponseEntity<List<MotivoCierreResponseDTO>> listar() {
        return ResponseEntity.ok(motivoCierreService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MotivoCierreResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(motivoCierreService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<MotivoCierreResponseDTO> crear(@Validated @RequestBody MotivoCierreRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(motivoCierreService.crear(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        motivoCierreService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
