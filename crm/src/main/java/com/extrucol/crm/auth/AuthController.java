package com.extrucol.crm.auth;

import com.extrucol.crm.config.JwtService;
import com.extrucol.crm.exception.UnauthorizedException;
import com.extrucol.crm.usuario.model.Usuario;
import com.extrucol.crm.usuario.repository.UsuarioRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService        jwtService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                   HttpServletResponse response) {

        Usuario usuario = usuarioRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));

        if (!usuario.getPassword().equals(request.password()))
            throw new UnauthorizedException("Credenciales inválidas");

        if (!usuario.getActivo())
            throw new UnauthorizedException("Usuario inactivo");

        Map<String, Object> claims = Map.of(
                "rol",    usuario.getRol().name(),
                "nombre", usuario.getNombre()
        );

        String accessToken  = jwtService.generateToken(usuario.getEmail(), claims);
        String refreshToken = jwtService.generateRefreshToken(usuario.getEmail());

        // Refresh token en cookie HttpOnly — JS nunca lo ve
        setRefreshCookie(response, refreshToken);

        return ResponseEntity.ok(Map.of(
                "token",  accessToken,
                "rol",    usuario.getRol().name(),
                "nombre", usuario.getNombre()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request,
                                     HttpServletResponse response) {

        // Leer cookie — el navegador la envía automáticamente
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("refreshToken".equals(c.getName())) {
                    refreshToken = c.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null)
            return ResponseEntity.status(401).body(Map.of("error", "Sin refresh token"));

        String email = jwtService.validateToken(refreshToken);
        if (email == null)
            return ResponseEntity.status(401).body(Map.of("error", "Refresh token inválido"));

        String type = jwtService.getClaim(refreshToken, c -> c.get("type", String.class));
        if (!"refresh".equals(type))
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido"));

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));

        Map<String, Object> claims = Map.of(
                "rol",    usuario.getRol().name(),
                "nombre", usuario.getNombre()
        );

        String newAccessToken  = jwtService.generateToken(email, claims);
        String newRefreshToken = jwtService.generateRefreshToken(email); // rotar

        setRefreshCookie(response, newRefreshToken);

        return ResponseEntity.ok(Map.of("token", newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message", "Sesión cerrada"));
    }

    // Helper — evitar repetir la config de la cookie
    private void setRefreshCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);          // JS no puede leerla
        cookie.setSecure(false);           // true en producción (HTTPS)
        cookie.setPath("/api/auth/refresh"); // solo se envía a ese endpoint
        cookie.setMaxAge(60 * 60 * 24 * 7); // 7 días
        response.addCookie(cookie);
    }
}