package com.extrucol.crm.auth;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void login_deberiaRetornarToken() throws Exception {

        String url = "http://localhost:" + port + "/api/auth/login";

        // 🔹 Request
        LoginRequest request = new LoginRequest(
                "juanperez@ejemplo.com",
                "Juan123"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(
                objectMapper.writeValueAsString(request),
                headers
        );

        // 🔹 Response
        ResponseEntity<String> response = restTemplate.postForEntity(
                url,
                entity,
                String.class
        );

        // 🔹 Validaciones
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("token");
    }

    @Test
    void login_deberiaFallar_conCredencialesIncorrectas() throws Exception {

        String url = "http://localhost:" + port + "/api/auth/login";

        LoginRequest request = new LoginRequest(
                "juanperez@ejemplo.com",
                "passwordIncorrecto"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(
                objectMapper.writeValueAsString(request),
                headers
        );

        ResponseEntity<String> response = restTemplate.postForEntity(
                url,
                entity,
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void login_deberiaFallar_cuandoUsuarioNoExiste() throws Exception {

        String url = "http://localhost:" + port + "/api/auth/login";

        LoginRequest request = new LoginRequest(
                "noexiste@ejemplo.com",
                "Juan123"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(
                objectMapper.writeValueAsString(request),
                headers
        );

        ResponseEntity<String> response = restTemplate.postForEntity(
                url,
                entity,
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

}

