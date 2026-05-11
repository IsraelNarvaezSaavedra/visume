package com.visume.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.visume.backend.dto.CurriculumRequestDTO;
import com.visume.backend.dto.CurriculumResponseDTO;
import com.visume.backend.entities.*;
import com.visume.backend.repositories.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CurriculumService {

    private final GeminiService geminiService;
    private final PromptsRepository promptsRepo;
    private final CurriculumsRepository curriculumsRepo;
    private final CurriculumSeccionesRepository seccionesRepo;
    private final CurriculumsMetadatosRepository metadatosRepo;
    private final ObjectMapper objectMapper;

    public CurriculumService(GeminiService geminiService,
                             PromptsRepository promptsRepo,
                             CurriculumsRepository curriculumsRepo,
                             CurriculumSeccionesRepository seccionesRepo,
                             CurriculumsMetadatosRepository metadatosRepo,
                             ObjectMapper objectMapper) {
        this.geminiService = geminiService;
        this.promptsRepo = promptsRepo;
        this.curriculumsRepo = curriculumsRepo;
        this.seccionesRepo = seccionesRepo;
        this.metadatosRepo = metadatosRepo;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public CurriculumResponseDTO generarYGuardar(CurriculumRequestDTO request, Usuarios usuario) throws Exception {

        // 1. Guardamos el prompt
        Prompts prompt = new Prompts();
        prompt.setUsuario(usuario);
        prompt.setContenido(request.getPrompt());
        prompt.setCreadoEn(LocalDateTime.now());
        promptsRepo.save(prompt);

        // 2. Llamamos a Gemini y obtenemos el DTO
        CurriculumResponseDTO geminiResponse = geminiService.generateCurriculum(request);

        // 3. Creamos el curriculum principal
        Curriculums curriculum = new Curriculums();
        curriculum.setPrompt(prompt);
        curriculum.setUsuario(usuario);
        curriculum.setTitulo(geminiResponse.getPersonalInfo().getName() + " - Curriculum");
        curriculum.setContenido(request.getPrompt());
        curriculum.setFechaCreacion(LocalDateTime.now());
        curriculum.setPublicado(false);
        curriculum.setIdioma("es");
        curriculumsRepo.save(curriculum);
        curriculumsRepo.flush();

        // 4. Guardamos cada sección
        guardarSeccion(curriculum, "personalInfo", geminiResponse.getPersonalInfo(), 1);
        guardarSeccion(curriculum, "experience",   geminiResponse.getExperience(),   2);
        guardarSeccion(curriculum, "education",    geminiResponse.getEducation(),     3);
        guardarSeccion(curriculum, "skills",       geminiResponse.getSkills(),        4);
        guardarSeccion(curriculum, "style",        geminiResponse.getStyle(),         5);

        // Solo en premium guardamos proyectos
        if ("premium".equals(request.getPlan())) {
            guardarSeccion(curriculum, "projects", geminiResponse.getProjects(), 6);
        }

        // 5. Guardamos los metadatos (para la búsqueda en la galería)
        CurriculumsMetadatos metadatos = new CurriculumsMetadatos();
        metadatos.setCurriculum(curriculum);
        metadatos.setSkills(String.join(",", geminiResponse.getSkills()));
        metadatos.setUbicacion(geminiResponse.getPersonalInfo().getLocation());
        metadatos.setUltimaExtraccion(LocalDateTime.now());
        System.out.println("ID curriculum: " + curriculum.getIdCurriculum());
        metadatosRepo.save(metadatos);

        return geminiResponse;
    }

    // Versión streaming para plan premium
    public Flux<String> generarStream(CurriculumRequestDTO request) {
        return geminiService.generateCurriculumStream(request);
    }

    private void guardarSeccion(Curriculums curriculum, String tipo, Object datos, int orden) {
        try {
            CurriculumSecciones seccion = new CurriculumSecciones();
            seccion.setCurriculum(curriculum);
            seccion.setTipoSeccion(tipo);
            seccion.setOrden(orden);
            seccion.setTituloSeccion(tipo);
            seccion.setDatos(objectMapper.writeValueAsString(datos));
            seccion.setCreadoEn(LocalDateTime.now());
            seccion.setActualizadoEn(LocalDateTime.now());
            seccionesRepo.save(seccion);
        } catch (Exception e) {
            throw new RuntimeException("Error guardando sección " + tipo + ": " + e.getMessage());
        }
    }
}