package com.extrucol.crm.oportunidad;

import com.extrucol.crm.oportunidad.dto.request.MontoMinimoRequestDTO;
import com.extrucol.crm.oportunidad.dto.response.MontoMinimoResponsetDTO;
import com.extrucol.crm.oportunidad.service.MontoMinimoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/montos-minimos")
@RequiredArgsConstructor
public class MontoMinimoController {

    private final MontoMinimoService montoMinimoService;

    @GetMapping
    public ResponseEntity<List<MontoMinimoResponsetDTO>> listar() {
        return ResponseEntity.ok(montoMinimoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MontoMinimoResponsetDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(montoMinimoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<MontoMinimoResponsetDTO> crear(@Validated @RequestBody MontoMinimoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(montoMinimoService.crear(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        montoMinimoService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
