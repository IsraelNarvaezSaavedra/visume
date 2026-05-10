package com.visume.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class GeminiConfig {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/" + model)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Bean
    public String geminiApiKey() {
        return apiKey;
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}