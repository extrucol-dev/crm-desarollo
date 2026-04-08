package com.extrucol.crm.auth;

import com.extrucol.crm.config.JwtService;
import com.extrucol.crm.exception.UnauthorizedException;
import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));

        if (!usuario.getPassword().equals(request.password())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        if (!usuario.getActivo()) {
            throw new UnauthorizedException("Usuario inactivo");
        }

        String token = jwtService.generateToken(
                usuario.getEmail(),
                Map.of(
                        "rol", usuario.getRol().name(),
                        "nombre", usuario.getNombre()
                )
        );
        System.out.println("SECURITY CONT " + SecurityContextHolder.getContext().getAuthentication());

        return Map.of(
                "token", token

        );
    }
}
