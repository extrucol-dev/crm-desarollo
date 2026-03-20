package com.extrucol.crm.controller;

import com.extrucol.crm.dto.request.UsuarioRequestDTO;
import com.extrucol.crm.dto.response.UsuarioResponseDTO;
import com.extrucol.crm.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
