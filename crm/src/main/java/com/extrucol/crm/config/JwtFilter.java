package com.extrucol.crm.config;

import com.extrucol.crm.exception.UnauthorizedException;
import com.extrucol.crm.model.Usuario;
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
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends GenericFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest http = (HttpServletRequest) request;
        String header = http.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token    = header.substring(7);
            String username = jwtService.validateToken(token);

            if (username != null) {
                Usuario usuario = usuarioRepository.findByEmail(username)
                        .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));

                List<GrantedAuthority> authorities = List.of(
                        new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())
                );

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(auth);
                System.out.println("GAAAAAAAAAAAAAAAAAAAA "+ SecurityContextHolder.getContext());
            }
        }

        chain.doFilter(request, response);
    }
}