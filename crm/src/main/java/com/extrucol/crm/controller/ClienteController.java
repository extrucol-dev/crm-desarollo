package com.extrucol.crm.controller;

import com.extrucol.crm.dto.request.ClienteRequestDTO;
import com.extrucol.crm.dto.response.cliente.ClienteOportunidadesResponseDTO;
import com.extrucol.crm.dto.response.cliente.ClienteResponseDTO;
import com.extrucol.crm.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    //endpoint de creacion de cliente
    @PostMapping
    public ResponseEntity<ClienteResponseDTO> crearCliente( @Validated @RequestBody ClienteRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> actualizar(
            @Validated @RequestBody ClienteRequestDTO dto,
            @PathVariable Long id){
        return ResponseEntity.ok(clienteService.actualizar(id,dto));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listar(){

        return ResponseEntity.ok(clienteService.listar());
    }

    @GetMapping("/listar")
    public ResponseEntity<List<ClienteResponseDTO>> listarPorEjecutivo(){
        return ResponseEntity.ok(clienteService.listarPorEjecutivo());
    }

    @GetMapping("/{id}/oportunidades")
    public ResponseEntity<ClienteOportunidadesResponseDTO> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteOportunidadesResponseDTO> buscarPorIdx(@PathVariable Long id){
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        clienteService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
