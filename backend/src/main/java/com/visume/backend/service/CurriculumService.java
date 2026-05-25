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
import java.util.UUID;

@Service
public class CurriculumService {

    private final GeminiService geminiService;
    private final PromptsRepository promptsRepo;
    private final CurriculumsRepository curriculumsRepo;
    private final CurriculumSeccionesRepository seccionesRepo;
    private final CurriculumsMetadatosRepository metadatosRepo;
    private final ObjectMapper objectMapper;
    private final CurriculumFotosRepository fotosRepo;

    public CurriculumService(GeminiService geminiService,
            PromptsRepository promptsRepo,
            CurriculumsRepository curriculumsRepo,
            CurriculumSeccionesRepository seccionesRepo,
            CurriculumsMetadatosRepository metadatosRepo,
            ObjectMapper objectMapper,
            CurriculumFotosRepository fotosRepo) {
        this.geminiService = geminiService;
        this.promptsRepo = promptsRepo;
        this.curriculumsRepo = curriculumsRepo;
        this.seccionesRepo = seccionesRepo;
        this.metadatosRepo = metadatosRepo;
        this.objectMapper = objectMapper;
        this.fotosRepo = fotosRepo;
    }

    @Transactional
    public CurriculumResponseDTO generarYGuardar(CurriculumRequestDTO request, Usuarios usuario) throws Exception {

        // 1. Comprobamos el límite de curriculums según el plan
        // Free
        int maxCurriculums = 1;
        if (usuario.getPlan() != null && usuario.getPlan().getMaxCurriculums() != null) {
            maxCurriculums = usuario.getPlan().getMaxCurriculums();
        } else if (usuario.isEstaPagando()) {
            // Premium
            maxCurriculums = 3;
        }

        long totalCurriculums = curriculumsRepo.countByUsuario(usuario);

        if (totalCurriculums >= maxCurriculums) {
            // Borramos el más antiguo para hacer sitio
            curriculumsRepo.deleteOldestByUsuario(usuario);
            curriculumsRepo.flush();
        }

        // 2. Guardamos el prompt
        Prompts prompt = new Prompts();
        prompt.setUsuario(usuario);
        prompt.setContenido(request.getPrompt());
        prompt.setCreadoEn(LocalDateTime.now());
        promptsRepo.save(prompt);

        // 3. Llamamos a Gemini
        CurriculumResponseDTO geminiResponse = geminiService.generateCurriculum(request);

        // 4. Creamos el curriculum
        Curriculums curriculum = new Curriculums();
        curriculum.setPrompt(prompt);
        curriculum.setUsuario(usuario);
        curriculum.setTitulo(geminiResponse.getPersonalInfo().getName() + " - Curriculum");
        curriculum.setContenido(request.getPrompt());
        curriculum.setFechaCreacion(LocalDateTime.now());
        curriculumsRepo.save(curriculum);
        curriculumsRepo.flush();

        // 5. Guardamos secciones
        guardarSeccion(curriculum, "personalInfo", geminiResponse.getPersonalInfo(), 1);
        guardarSeccion(curriculum, "experience", geminiResponse.getExperience(), 2);
        guardarSeccion(curriculum, "education", geminiResponse.getEducation(), 3);
        guardarSeccion(curriculum, "skills", geminiResponse.getSkills(), 4);
        guardarSeccion(curriculum, "style", geminiResponse.getStyle(), 5);
        if ("premium".equals(request.getPlan())) {
            guardarSeccion(curriculum, "projects", geminiResponse.getProjects(), 6);
        }

        // 6. Metadatos
        CurriculumsMetadatos metadatos = new CurriculumsMetadatos();
        metadatos.setCurriculum(curriculum);
        CurriculumResponseDTO.Skills skills = geminiResponse.getSkills();
        if (skills != null && skills.getTechnical() != null) {
            metadatos.setSkills(String.join(",", skills.getTechnical()));
        }
        metadatos.setUbicacion(geminiResponse.getPersonalInfo().getLocation());
        metadatos.setUltimaExtraccion(LocalDateTime.now());
        metadatosRepo.save(metadatos);
        geminiResponse.setId(curriculum.getIdCurriculum());

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

    @Transactional
    public void actualizarSecciones(Integer id, CurriculumResponseDTO data, String username) throws Exception {
        Curriculums curriculum = curriculumsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Curriculum no encontrado"));

        if (!curriculum.getUsuario().getUsername().equals(username))
            throw new RuntimeException("No tienes permiso");

        // Obtener template anterior
        String templateAnterior = null;
        var styleAnterior = seccionesRepo.findByCurriculumAndTipoSeccion(curriculum, "style");
        if (styleAnterior.isPresent()) {
            CurriculumResponseDTO.Style styleObj = objectMapper.readValue(
                styleAnterior.get().getDatos(), 
                CurriculumResponseDTO.Style.class
            );
            templateAnterior = styleObj.getTemplate();
        }

        String templateNuevo = data.getStyle().getTemplate();
        String[] plantillasPremium = { "bold", "creative", "elegant", "modernpro" };

        boolean eraPlantillaPremium = esPlantillaPremium(templateAnterior, plantillasPremium);
        boolean esAhoraPlantillaPremium = esPlantillaPremium(templateNuevo, plantillasPremium);

        // Generar shareCode si cambió a plantilla premium
        if (esAhoraPlantillaPremium && !eraPlantillaPremium && curriculum.getShareCode() == null) {
            curriculum.setShareCode(generarShareCode());
        } 
        // Eliminar shareCode si cambió a plantilla normal
        else if (!esAhoraPlantillaPremium && eraPlantillaPremium && curriculum.getShareCode() != null) {
            curriculum.setShareCode(null);
        }

        // Actualiza cada sección
        actualizarSeccion(curriculum, "personalInfo", data.getPersonalInfo());
        actualizarSeccion(curriculum, "experience", data.getExperience());
        actualizarSeccion(curriculum, "education", data.getEducation());
        actualizarSeccion(curriculum, "skills", data.getSkills());
        actualizarSeccion(curriculum, "style", data.getStyle());
        if (data.getProjects() != null)
            actualizarSeccion(curriculum, "projects", data.getProjects());
        if (data.getCertifications() != null)
            actualizarSeccion(curriculum, "certifications", data.getCertifications());
        if (data.getLanguages() != null)
            actualizarSeccion(curriculum, "languages", data.getLanguages());

        curriculum.setTitulo(data.getPersonalInfo().getName() + " - Curriculum");
        curriculumsRepo.save(curriculum);
    }

    private boolean esPlantillaPremium(String template, String[] plantillasPremium) {
        if (template == null) return false;
        for (String premium : plantillasPremium) {
            if (premium.equals(template)) return true;
        }
        return false;
    }

    private String generarShareCode() {
        return UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }

    private void actualizarSeccion(Curriculums curriculum, String tipo, Object datos) throws Exception {
        seccionesRepo.findByCurriculumAndTipoSeccion(curriculum, tipo)
                .ifPresentOrElse(
                        seccion -> {
                            try {
                                seccion.setDatos(objectMapper.writeValueAsString(datos));
                                seccion.setActualizadoEn(LocalDateTime.now());
                                seccionesRepo.save(seccion);
                            } catch (Exception e) {
                                throw new RuntimeException(e);
                            }
                        },
                        () -> guardarSeccion(curriculum, tipo, datos, 99));
    }
    
    public CurriculumResponseDTO obtenerCurriculum(Integer id, String username) throws Exception {
    Curriculums curriculum = curriculumsRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Curriculum no encontrado"));

    if (!curriculum.getUsuario().getUsername().equals(username))
        throw new RuntimeException("No tienes permiso");

    CurriculumResponseDTO dto = new CurriculumResponseDTO();
    dto.setId(curriculum.getIdCurriculum());
    dto.setShareCode(curriculum.getShareCode());

    List<CurriculumSecciones> secciones = seccionesRepo.findByCurriculum(curriculum);

    for (CurriculumSecciones seccion : secciones) {
        String datos = seccion.getDatos();
        switch (seccion.getTipoSeccion()) {
            case "personalInfo" -> dto.setPersonalInfo(objectMapper.readValue(datos, CurriculumResponseDTO.PersonalInfo.class));
            case "experience"   -> dto.setExperience(objectMapper.readValue(datos, objectMapper.getTypeFactory().constructCollectionType(List.class, CurriculumResponseDTO.Experience.class)));
            case "education"    -> dto.setEducation(objectMapper.readValue(datos, objectMapper.getTypeFactory().constructCollectionType(List.class, CurriculumResponseDTO.Education.class)));
            case "skills"       -> dto.setSkills(objectMapper.readValue(datos, CurriculumResponseDTO.Skills.class));
            case "style"        -> dto.setStyle(objectMapper.readValue(datos, CurriculumResponseDTO.Style.class));
            case "projects"     -> dto.setProjects(objectMapper.readValue(datos, objectMapper.getTypeFactory().constructCollectionType(List.class, CurriculumResponseDTO.Project.class)));
            case "certifications" -> dto.setCertifications(objectMapper.readValue(datos, objectMapper.getTypeFactory().constructCollectionType(List.class, CurriculumResponseDTO.Certification.class)));
            case "languages"    -> dto.setLanguages(objectMapper.readValue(datos, objectMapper.getTypeFactory().constructCollectionType(List.class, CurriculumResponseDTO.Language.class)));
        }
    }

    List<CurriculumFotos> fotos = fotosRepo.findByCurriculumIdCurriculumOrderByOrdenAsc(curriculum.getIdCurriculum());
if (!fotos.isEmpty()) {
    dto.setFotoPrincipal(fotos.stream()
        .filter(CurriculumFotos::isEsPrincipal)
        .findFirst()
        .map(CurriculumFotos::getUrl)
        .orElse(fotos.get(0).getUrl()));
    dto.setFotosGaleria(fotos.stream()
        .map(CurriculumFotos::getUrl)
        .toList());
}

    return dto;
}

public CurriculumResponseDTO obtenerCurriculumPublico(String shareCode) throws Exception {
    Curriculums curriculum = curriculumsRepo.findByShareCode(shareCode)
            .orElseThrow(() -> new RuntimeException("Curriculum no encontrado"));

    CurriculumResponseDTO dto = new CurriculumResponseDTO();
    dto.setId(curriculum.getIdCurriculum());
    dto.setShareCode(curriculum.getShareCode());

    List<CurriculumSecciones> secciones = seccionesRepo.findByCurriculum(curriculum);

    for (CurriculumSecciones seccion : secciones) {
        String datos = seccion.getDatos();
        switch (seccion.getTipoSeccion()) {
            case "personalInfo" -> dto.setPersonalInfo(objectMapper.readValue(datos, CurriculumResponseDTO.PersonalInfo.class));
            case "experience"   -> dto.setExperience(objectMapper.readValue(datos, objectMapper.getTypeFactory().constructCollectionType(List.class, CurriculumResponseDTO.Experience.class)));
            case "education"    -> dto.setEducation(objectMapper.readValue(datos, objectMapper.getTypeFactory().constructCollectionType(List.class, CurriculumResponseDTO.Education.class)));
            case "skills"       -> dto.setSkills(objectMapper.readValue(datos, CurriculumResponseDTO.Skills.class));
            case "style"        -> dto.setStyle(objectMapper.readValue(datos, CurriculumResponseDTO.Style.class));
            case "projects"     -> dto.setProjects(objectMapper.readValue(datos, objectMapper.getTypeFactory().constructCollectionType(List.class, CurriculumResponseDTO.Project.class)));
            case "certifications" -> dto.setCertifications(objectMapper.readValue(datos, objectMapper.getTypeFactory().constructCollectionType(List.class, CurriculumResponseDTO.Certification.class)));
            case "languages"    -> dto.setLanguages(objectMapper.readValue(datos, objectMapper.getTypeFactory().constructCollectionType(List.class, CurriculumResponseDTO.Language.class)));
        }
    }

    List<CurriculumFotos> fotos = fotosRepo.findByCurriculumIdCurriculumOrderByOrdenAsc(curriculum.getIdCurriculum());
    if (!fotos.isEmpty()) {
        dto.setFotoPrincipal(fotos.stream()
            .filter(CurriculumFotos::isEsPrincipal)
            .findFirst()
            .map(CurriculumFotos::getUrl)
            .orElse(fotos.get(0).getUrl()));
        dto.setFotosGaleria(fotos.stream()
            .map(CurriculumFotos::getUrl)
            .toList());
    }

    return dto;
}
}