package com.extrucol.crm.auth;

import com.extrucol.crm.config.JwtService;
import com.extrucol.crm.exception.BusinessRuleException;
import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        System.out.println(usuarioRepository.existsByEmail(request.email()));
        Usuario usuario = usuarioRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new BusinessRuleException("Usuario no encontrado"));

        if (!usuario.getPassword().equals(request.password())) {
            throw new BusinessRuleException("Credenciales inválidas");
        }

        if (!usuario.getActivo()) {
            throw new BusinessRuleException("Usuario inactivo");
        }

        String token = jwtService.generateToken(usuario.getEmail());

        return Map.of(
                "token", token
        );
    }
}
