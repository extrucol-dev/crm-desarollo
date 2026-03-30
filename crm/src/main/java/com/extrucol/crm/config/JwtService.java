package com.extrucol.crm.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final String SECRET = "topSecretMasterkey12345YaNoSeQueMasPonerAqui11111111111";

    private final long EXPIRATION = 1000 * 60 * 30; // 30 minutos

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // Generar token
    public String generateToken(String username, Map<String, Object> extraClaims) {

        return Jwts.builder()
                .setSubject(username)
                .addClaims(extraClaims) // 🔥 aquí va el map
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validar token
    public String validateToken(String token) {

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }

}
