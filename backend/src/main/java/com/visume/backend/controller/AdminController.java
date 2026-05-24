package com.visume.backend.controller;

import com.visume.backend.dto.AdminCurriculumDTO;
import com.visume.backend.dto.AdminUsuarioDTO;
import com.visume.backend.entities.Rol;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.UsuariosRepository;
import com.visume.backend.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;
    private final UsuariosRepository usuariosRepo;

    public AdminController(AdminService adminService, UsuariosRepository usuariosRepo) {
        this.adminService = adminService;
        this.usuariosRepo = usuariosRepo;
    }

    private void verificarAdmin(String username) {
        Usuarios usuario = usuariosRepo.findById(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (usuario.getRol() != Rol.ADMINISTRADOR) {
            throw new RuntimeException("No autorizado");
        }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios(@AuthenticationPrincipal String username) {
        try {
            verificarAdmin(username);
            return ResponseEntity.ok(adminService.listarUsuarios());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PutMapping("/usuarios/{usernameTarget}")
    public ResponseEntity<?> actualizarUsuario(@AuthenticationPrincipal String username,
                                               @PathVariable String usernameTarget,
                                               @RequestBody Map<String, Object> body) {
        try {
            verificarAdmin(username);
            String rol = (String) body.get("rol");
            Boolean estaPagando = (Boolean) body.get("estaPagando");
            // Evitar que un administrador se quite el rol a sí mismo
            if (username != null && username.equals(usernameTarget) && rol != null && !rol.equals("ADMINISTRADOR")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No puedes quitarte el rol de administrador");
            }
            adminService.actualizarUsuario(usernameTarget, rol, estaPagando);
            return ResponseEntity.ok("Usuario actualizado");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/usuarios/{usernameTarget}")
    public ResponseEntity<?> eliminarUsuario(@AuthenticationPrincipal String username,
                                             @PathVariable String usernameTarget) {
        try {
            verificarAdmin(username);
            adminService.eliminarUsuario(usernameTarget);
            return ResponseEntity.ok("Usuario eliminado");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/curriculums")
    public ResponseEntity<?> listarCurriculums(@AuthenticationPrincipal String username) {
        try {
            verificarAdmin(username);
            return ResponseEntity.ok(adminService.listarCurriculums());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/curriculums/{id}")
    public ResponseEntity<?> eliminarCurriculum(@AuthenticationPrincipal String username,
                                                @PathVariable Integer id) {
        try {
            verificarAdmin(username);
            adminService.eliminarCurriculum(id);
            return ResponseEntity.ok("Curriculum eliminado");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
