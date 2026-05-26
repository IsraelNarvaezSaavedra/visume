package com.visume.backend.controller;

import com.visume.backend.dto.CurriculumRequestDTO;
import com.visume.backend.dto.CurriculumResponseDTO;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.UsuariosRepository;
import com.visume.backend.service.CurriculumService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/curriculum")
@CrossOrigin(origins = {
    "http://isra.francecentral.cloudapp.azure.com",
    "https://isra.francecentral.cloudapp.azure.com",
    "http://localhost:5173",
    "http://localhost:3000"
})
public class CurriculumController {

    private final CurriculumService curriculumService;
    private final UsuariosRepository usuariosRepo;

    public CurriculumController(CurriculumService curriculumService,
            UsuariosRepository usuariosRepo) {
        this.curriculumService = curriculumService;
        this.usuariosRepo = usuariosRepo;
    }

    // Plan gratuito: respuesta completa de una vez
    @PostMapping("/generate")
    public ResponseEntity<CurriculumResponseDTO> generate(@RequestBody CurriculumRequestDTO request,
            @AuthenticationPrincipal String username) {
        try {
            Usuarios usuario = usuariosRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Forzamos el plan según lo que tiene el usuario en BD
            request.setPlan(usuario.isEstaPagando() ? "premium" : "free");

            CurriculumResponseDTO response = curriculumService.generarYGuardar(request, usuario);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
public ResponseEntity<?> obtener(@PathVariable Integer id,
                                  @AuthenticationPrincipal String username) {
    try {
        CurriculumResponseDTO response = curriculumService.obtenerCurriculum(id, username);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
@PutMapping("/{id}")
public ResponseEntity<?> actualizar(@PathVariable Integer id,
                                     @RequestBody CurriculumResponseDTO data,
                                     @AuthenticationPrincipal String username) {
    try {
        curriculumService.actualizarSecciones(id, data, username);
        return ResponseEntity.ok("Curriculum actualizado");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@GetMapping("/public/{shareCode}")
public ResponseEntity<?> obtenerPublico(@PathVariable String shareCode) {
    try {
        CurriculumResponseDTO response = curriculumService.obtenerCurriculumPublico(shareCode);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}