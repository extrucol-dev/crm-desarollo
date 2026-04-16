package com.extrucol.crm.config;

import com.extrucol.crm.auth.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity // ← habilita @PreAuthorize si lo necesitas después
public class SecurityConfig {

    private final JwtFilter          jwtFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                .authorizeHttpRequests(auth -> auth

                        // ── Públicos ──────────────────────────────────────────
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/refresh",
                                "/api/auth/logout",
                                "/login/oauth2/**",
                                "/oauth2/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ── Ciudades — todos los roles autenticados ───────────
                        .requestMatchers("/api/ciudades/**").authenticated()

                        // ── Catálogos de Oportunidad — DIRECTOR y ADMIN ───────
                        .requestMatchers("/api/motivos-cierre/**").hasAnyRole("DIRECTOR", "ADMIN")
                        .requestMatchers("/api/montos-minimos/**").hasAnyRole("DIRECTOR", "ADMIN")

                        // ── Auditoría — solo DIRECTOR y ADMIN ─────────────────
                        .requestMatchers("/api/auditorias/**").hasAnyRole("DIRECTOR", "ADMIN")

                        // ── Usuarios ─────────────────────────────
                        .requestMatchers("/api/usuarios/**").hasAnyRole("DIRECTOR", "ADMIN")



                        // ── Clientes ──────────────────────────────────────────
                        // DIRECTOR solo puede listar todos
                        .requestMatchers(HttpMethod.GET, "/api/clientes").hasAnyRole("EJECUTIVO", "DIRECTOR", "ADMIN")
                        // EJECUTIVO gestiona sus clientes
                        .requestMatchers("/api/clientes/**").hasRole("EJECUTIVO")

                        // ── Oportunidades ─────────────────────────────────────
                        // DIRECTOR ve todas
                        .requestMatchers(HttpMethod.GET, "/api/oportunidades/todas").hasRole("DIRECTOR")
                        .requestMatchers(HttpMethod.GET, "/api/oportunidades/{id}/actividades").hasAnyRole("DIRECTOR", "EJECUTIVO")
                        .requestMatchers(HttpMethod.GET, "/api/oportunidades/{id}/detalles").hasAnyRole("DIRECTOR", "EJECUTIVO")
                        // EJECUTIVO gestiona las propias
                        .requestMatchers("/api/oportunidades/**").hasRole("EJECUTIVO")

                        // ── Actividades ───────────────────────────────────────
                        // DIRECTOR ve todas
                        .requestMatchers(HttpMethod.GET, "/api/actividades/todas").hasRole("DIRECTOR")
                        // EJECUTIVO gestiona las propias
                        .requestMatchers("/api/actividades/**").hasAnyRole("EJECUTIVO", "DIRECTOR")

                        // ── Proyectos ─────────────────────────────────────────
                        // DIRECTOR ve todos
                        .requestMatchers(HttpMethod.GET, "/api/proyectos/todos").hasRole("DIRECTOR")
                        .requestMatchers(HttpMethod.GET, "/api/proyectos/{id}").hasAnyRole("EJECUTIVO", "DIRECTOR")
                        // EJECUTIVO gestiona los propios
                        .requestMatchers("/api/proyectos/**").hasRole("EJECUTIVO")

                        // ── Cualquier otra ruta requiere autenticación ─────────
                        .anyRequest().authenticated()
                )

                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2SuccessHandler)
                        .failureUrl("/login?error=oauth2")
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}