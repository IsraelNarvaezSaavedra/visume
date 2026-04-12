package com.visume.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.visume.backend.dto.LoginRequest;
import com.visume.backend.dto.LoginResponse;
import com.visume.backend.dto.RegisterRequest;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.service.UsuariosService;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class UsuariosController {
	private final UsuariosService usuarioService;

    public UsuariosController(UsuariosService usuarioService) {
        this.usuarioService = usuarioService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegisterRequest dto) {
    	try {
    		
            Usuarios nuevo = usuarioService.registrarUsuario(dto);
            return ResponseEntity.ok("Usuario registrado con éxito: " + nuevo.getUsername());
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest usuario) {
        try {
        	LoginResponse response = usuarioService.loguearUsuario(usuario);
        	return ResponseEntity.ok(response);
            
        } catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
