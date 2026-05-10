package com.visume.backend.controller;

import com.visume.backend.dto.CurriculumRequestDTO;
import com.visume.backend.dto.CurriculumResponseDTO;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.UsuariosRepository;
import com.visume.backend.service.CurriculumService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/curriculum")
@CrossOrigin(origins = "http://localhost:5173")
public class CurriculumController {

    private final CurriculumService curriculumService;
    private final UsuariosRepository usuariosRepo;

    public CurriculumController(CurriculumService curriculumService,
                                UsuariosRepository usuariosRepo) {
        this.curriculumService = curriculumService;
        this.usuariosRepo = usuariosRepo;
    }

    // Plan premium: streaming en tiempo real
    @PostMapping(value = "/generate/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> generateStream(@RequestBody CurriculumRequestDTO request,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        // El plan lo sacamos del usuario autenticado
        return curriculumService.generarStream(request);
    }

    // Plan gratuito: respuesta completa de una vez
    @PostMapping("/generate")
    public ResponseEntity<CurriculumResponseDTO> generate(@RequestBody CurriculumRequestDTO request,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuarios usuario = usuariosRepo.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Forzamos el plan según lo que tiene el usuario en BD
            request.setPlan(usuario.isEstaPagando() ? "premium" : "free");

            CurriculumResponseDTO response = curriculumService.generarYGuardar(request, usuario);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}