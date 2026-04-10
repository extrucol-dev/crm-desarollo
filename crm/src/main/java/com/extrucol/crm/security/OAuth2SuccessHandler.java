package com.extrucol.crm.security;

import com.extrucol.crm.model.Usuario;
import com.extrucol.crm.repository.UsuarioRepository;
import com.extrucol.crm.config.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    // URL del frontend — ajusta según tu entorno
    private static final String FRONTEND_URL = "http://localhost:5173/oauth2/callback";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

        UserDetails userDetails = userDetailsService.loadUserByUsername(oidcUser.getEmail());

        Map<String, Object> claims = Map.of(
                "rol",    userDetails.getAuthorities(),
                "nombre", userDetails.getUsername()
        );

        String accessToken  = jwtService.generateToken(userDetails, claims);
        String refreshToken = jwtService.generateRefreshToken(userDetails.getUsername());

        // Cookie igual que en login
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(60 * 60 * 24 * 7);
        response.addCookie(cookie);

        // Solo access token en la URL
        String redirectUrl = FRONTEND_URL + "?token=" + accessToken;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

}