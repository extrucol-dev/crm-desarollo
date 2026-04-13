package com.extrucol.crm.usuario;

import com.extrucol.crm.usuario.dto.request.UsuarioEstadoRequestDTO;
import com.extrucol.crm.usuario.dto.request.UsuarioRequestDTO;
import com.extrucol.crm.usuario.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    //endpoint de creacion de usuario
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crearUsuario( @Validated @RequestBody UsuarioRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(
            @Validated @RequestBody UsuarioRequestDTO dto,
            @PathVariable Long id){
        return ResponseEntity.ok(usuarioService.actualizar(id,dto));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<UsuarioResponseDTO> actualizarEstado(
            @Validated @RequestBody UsuarioEstadoRequestDTO dto,
            @PathVariable Long id){
        return ResponseEntity.ok(usuarioService.actualizarEstado(id,dto));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listar(){
        return ResponseEntity.ok(usuarioService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        usuarioService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
