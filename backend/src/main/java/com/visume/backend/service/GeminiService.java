package com.visume.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.visume.backend.dto.CurriculumRequestDTO;
import com.visume.backend.dto.CurriculumResponseDTO;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient geminiWebClient;
    private final String geminiApiKey;
    private final ObjectMapper objectMapper;

    public GeminiService(WebClient geminiWebClient,
                         @Qualifier("geminiApiKey") String geminiApiKey,
                         ObjectMapper objectMapper) {
        this.geminiWebClient = geminiWebClient;
        this.geminiApiKey = geminiApiKey;
        this.objectMapper = objectMapper;
    }

    private String buildSystemPrompt(String plan) {
        String base = """
            Eres un experto en diseño de curriculums y portfolios profesionales.
            El usuario te va a describir quién es, su experiencia, habilidades y preferencias visuales.
            
            Tu tarea es extraer y estructurar toda esa información y devolverla ÚNICAMENTE en formato JSON,
            sin ningún texto adicional, sin bloques de código markdown, solo el JSON puro.
            
            El JSON debe seguir exactamente esta estructura:
            {
              "personalInfo": {
                "name": "",
                "title": "",
                "bio": "",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "github": "",
                "website": ""
              },
              "experience": [
                {
                  "company": "",
                  "position": "",
                  "startDate": "",
                  "endDate": "",
                  "description": ""
                }
              ],
              "education": [
                {
                  "institution": "",
                  "degree": "",
                  "startDate": "",
                  "endDate": ""
                }
              ],
              "skills": ["skill1", "skill2"],
              "projects": [
                {
                  "name": "",
                  "description": "",
                  "technologies": [],
                  "url": ""
                }
              ],
              "style": {
                "primaryColor": "#hexcolor",
                "secondaryColor": "#hexcolor",
                "template": "minimal|modern|creative",
                "font": "inter|playfair|roboto"
              }
            }
            
            Completa los campos que puedas inferir del texto del usuario.
            Deja vacíos ("") los que no mencione.
            El campo 'bio' debe ser una descripción profesional mejorada y pulida basada en lo que diga el usuario.
            Infiere los colores del estilo que pida el usuario.
            """;

        if ("free".equals(plan)) {
            base += "\nNOTA: Plan gratuito. No incluyas proyectos ni URLs de imágenes.";
        } else {
            base += "\nNOTA: Plan premium. Incluye todos los campos y enriquece al máximo el contenido.";
        }

        return base;
    }

    // Streaming — devuelve chunks de texto según llegan
    public Flux<String> generateCurriculumStream(CurriculumRequestDTO request) {
        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(
                    Map.of("text", buildSystemPrompt(request.getPlan())
                            + "\n\nUsuario dice:\n" + request.getPrompt())
                ))
            ),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 4096
            )
        );

        return geminiWebClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path(":streamGenerateContent")
                        .queryParam("alt", "sse")
                        .queryParam("key", geminiApiKey)
                        .build())
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .filter(chunk -> chunk.startsWith("data: "))
                .map(chunk -> chunk.substring(6))
                .filter(chunk -> !chunk.equals("[DONE]"))
                .mapNotNull(chunk -> {
                    try {
                        var node = objectMapper.readTree(chunk);
                        return node.at("/candidates/0/content/parts/0/text").asText(null);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(text -> text != null && !text.isEmpty());
    }

    // Sin streaming — espera y devuelve el JSON completo parseado
    public CurriculumResponseDTO generateCurriculum(CurriculumRequestDTO request) {
        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(
                    Map.of("text", buildSystemPrompt(request.getPlan())
                            + "\n\nUsuario dice:\n" + request.getPrompt())
                ))
            ),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 4096
            )
        );

        String raw = geminiWebClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path(":generateContent")
                        .queryParam("key", geminiApiKey)
                        .build())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            var node = objectMapper.readTree(raw);
            String jsonText = node.at("/candidates/0/content/parts/0/text").asText();
            // Limpia posibles bloques markdown que Gemini añada
            jsonText = jsonText.replaceAll("```json", "").replaceAll("```", "").trim();
            return objectMapper.readValue(jsonText, CurriculumResponseDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parseando respuesta de Gemini: " + e.getMessage());
        }
    }
}