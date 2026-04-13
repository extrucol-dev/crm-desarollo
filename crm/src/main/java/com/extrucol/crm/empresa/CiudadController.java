package com.extrucol.crm.empresa;

import com.extrucol.crm.empresa.dto.response.CiudadResponseDTO;
import com.extrucol.crm.empresa.service.CiudadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ciudades")
@RequiredArgsConstructor
public class CiudadController {
    private final CiudadService ciudadService;

    @GetMapping
    public ResponseEntity<List<CiudadResponseDTO>> listar(){
        return ResponseEntity.ok(ciudadService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CiudadResponseDTO> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(ciudadService.buscarPorId(id));
    }
}
