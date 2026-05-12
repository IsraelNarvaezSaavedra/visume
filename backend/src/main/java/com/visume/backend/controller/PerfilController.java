package com.visume.backend.controller;

import com.visume.backend.dto.ActualizarPerfilDTO;
import com.visume.backend.dto.PerfilResponseDTO;
import com.visume.backend.service.PerfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = "http://localhost:5173")
public class PerfilController {

    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping
    public ResponseEntity<PerfilResponseDTO> obtenerPerfil(@AuthenticationPrincipal String username) {
        return ResponseEntity.ok(perfilService.obtenerPerfil(username));
    }

    @PutMapping
    public ResponseEntity<?> actualizarPerfil(@AuthenticationPrincipal String username,
                                               @RequestBody ActualizarPerfilDTO dto) {
        try {
            perfilService.actualizarPerfil(username, dto);
            return ResponseEntity.ok("Perfil actualizado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/curriculum/{id}")
    public ResponseEntity<?> eliminarCurriculum(@AuthenticationPrincipal String username,
                                                 @PathVariable Integer id) {
        try {
            perfilService.eliminarCurriculum(username, id);
            return ResponseEntity.ok("Curriculum eliminado");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}