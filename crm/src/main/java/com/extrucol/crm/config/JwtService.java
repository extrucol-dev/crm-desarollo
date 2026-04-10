package com.extrucol.crm.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final String SECRET          = "topSecretMasterkey12345YaNoSeQueMasPonerAqui11111111111";
    private final long   EXPIRATION      = 1000L * 60 * 2;          // 2 min
    private final long   REFRESH_EXPIRATION = 1000L * 60 * 60 * 24 * 7; // 7 días

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // Access token — igual que antes
    public String generateToken(UserDetails username, Map<String, Object> extraClaims) {
        return Jwts.builder()
                .setSubject(username.getUsername())
                .setClaims(extraClaims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Refresh token — solo subject + type
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .claim("type", "refresh")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

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

    public <T> T getClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return resolver.apply(claims);
    }

    // Extraer rol y nombre para replicarlos en el nuevo access token
    public Map<String, Object> getExtraClaims(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        Map<String, Object> extra = new HashMap<>();
        if (claims.get("rol")    != null) extra.put("rol",    claims.get("rol"));
        if (claims.get("nombre") != null) extra.put("nombre", claims.get("nombre"));
        return extra;
    }
}