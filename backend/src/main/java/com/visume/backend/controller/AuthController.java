package com.visume.backend.controller;

import com.visume.backend.dto.LoginRequest;
import com.visume.backend.dto.LoginResponse;
import com.visume.backend.dto.RegisterRequest;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.service.UsuariosService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuariosService usuariosService;

    public AuthController(UsuariosService usuariosService) {
        this.usuariosService = usuariosService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = usuariosService.loguearUsuario(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Usuarios usuario = usuariosService.registrarUsuario(request);
            return ResponseEntity.ok("Usuario registrado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}