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
                Eres un redactor experto en currículums profesionales de alto impacto, especializado en el formato Europass y estándares internacionales.

                El usuario te va a describir su perfil profesional. Tu tarea es:
                1. Extraer TODA la información mencionada sin omitir nada
                2. Redactar los textos en PRIMERA PERSONA (lideré, desarrollé, gestioné...)
                3. Enriquecer y mejorar el lenguaje sin inventar datos nuevos
                4. Usar verbos de acción potentes (lideré, implementé, optimicé, escalé, diseñé...)
                5. Mantener los números y métricas exactas que mencione el usuario (45%, $2M, etc.)
                6. Si el usuario no menciona algún campo, déjalo vacío (""), NUNCA inventes datos

                IMPORTANTE:
                - No omitas ninguna experiencia, habilidad o dato mencionado
                - Si menciona varias empresas, inclúyelas TODAS con su descripción completa
                - Si menciona habilidades, inclúyelas TODAS separadas por categoría
                - Las descripciones de experiencia deben ser ricas: contexto + acciones + resultados
                - El bio debe ser un párrafo potente de 3-5 líneas que enganchen al reclutador

                Devuelve ÚNICAMENTE este JSON sin texto adicional ni bloques markdown:
                {
                  "personalInfo": {
                    "name": "",
                    "title": "",
                    "bio": "párrafo de 3-5 líneas en primera persona, impactante y orientado al puesto objetivo",
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
                      "startDate": "MM/YYYY",
                      "endDate": "MM/YYYY o Actualidad",
                      "location": "",
                      "description": "Párrafo de 3-5 frases en primera persona: contexto del rol, principales responsabilidades y logros cuantificables",
                      "achievements": ["logro 1 con métrica", "logro 2 con métrica", "logro 3"]
                    }
                  ],
                  "education": [
                    {
                      "institution": "",
                      "degree": "",
                      "field": "",
                      "startDate": "YYYY",
                      "endDate": "YYYY",
                      "location": "",
                      "description": "menciona especialización, TFG/TFM, o logros académicos si los hay"
                    }
                  ],
                  "skills": {
                    "technical": ["skill técnico 1", "skill técnico 2"],
                    "soft": ["habilidad blanda 1", "habilidad blanda 2"],
                    "languages": ["Español - Nativo", "Inglés - B2"],
                    "tools": ["herramienta 1", "herramienta 2"]
                  },
                  "projects": [
                    {
                      "name": "",
                      "description": "2-3 frases describiendo el proyecto, tu rol y el impacto",
                      "technologies": [],
                      "url": "",
                      "startDate": "",
                      "endDate": ""
                    }
                  ],
                  "certifications": [
                    {
                      "name": "",
                      "issuer": "",
                      "date": "",
                      "url": ""
                    }
                  ],
                  "languages": [
                    {
                      "language": "",
                      "level": "A1|A2|B1|B2|C1|C2|Nativo"
                    }
                  ],
                  "interests": ["interés 1", "interés 2"],
                  "style": {
                    "primaryColor": "#hexcolor",
                    "secondaryColor": "#hexcolor",
                    "template": "minimal|modern|creative",
                    "font": "inter|playfair|roboto"
                  }
                }

                Reglas de redacción:
                - bio: primera persona, tono profesional ("Soy un Senior PM con 10 años...")
                - experience.description: contexto + responsabilidades + logros con métricas
                - experience.achievements: lista de 2-4 logros concretos con números cuando sea posible
                - education.description: solo si hay algo relevante que mencionar
                - NO uses tercera persona nunca
                - NO inventes datos, empresas, fechas, certificaciones ni idiomas
                - SÍ infiere el color/estilo si el usuario lo menciona
                - SÍ puedes inferir idiomas básicos si el usuario escribe en español (Español Nativo)
                - skills debe estar categorizado: técnicas, blandas, idiomas, herramientas
                """;

        if ("free".equals(plan)) {
            base += "\nPlan gratuito: incluye personalInfo, experience, education y skills. No incluyas projects ni certifications.";
        } else {
            base += "\nPlan premium: incluye TODOS los campos con el máximo detalle posible. Enriquece cada sección al máximo.";
        }

        return base;
    }

    // Sin streaming — espera y devuelve el JSON completo parseado
    public CurriculumResponseDTO generateCurriculum(CurriculumRequestDTO request) {
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("role", "user", "parts", List.of(
                                Map.of("text", buildSystemPrompt(request.getPlan())
                                        + "\n\nUsuario dice:\n" + request.getPrompt())))),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 8192));

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