package com.extrucol.crm.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenApi(){
        return new OpenAPI()
                .info(new Info()
                        .title("API DOCUMENTADA DEl CRM EXTRUCOL")
                        .version("1.0")
                        .description("Api para el sistema de gestion de oportunidades comerciales de EXTRUCOL"));
    }
}
