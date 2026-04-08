package com.extrucol.crm.config;

import com.extrucol.crm.exception.UnauthorizedException;
import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.UbicacionRepository;
import com.extrucol.crm.repository.UsuarioRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component// Le digo a Spring que este filtro es un componente manejado por el contenedor
@RequiredArgsConstructor
public class JwtFilter extends GenericFilter {
    /*
     * Inyecto mi JwtService.
     * Este servicio es el que sabe validar el token.
     */
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    /*
     * Este método se ejecuta en CADA petición que llega al servidor.
     * Aquí es donde revisamos si el request trae un token válido.
     */
    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest http = (HttpServletRequest) request;

        String header = http.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            String username = jwtService.validateToken(token);

            if (username != null) {
                Usuario usuario = usuarioRepository.findByEmail(username)
                        .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));

                String rol = usuario.getRol().name();

                List<GrantedAuthority> authorities = List.of(
                        new SimpleGrantedAuthority("ROLE_" + rol)
                );
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                authorities
                        );
                System.out.println("AUTH" + auth);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }
}
