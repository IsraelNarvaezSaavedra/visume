package com.visume.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

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
    public ResponseEntity<?> registrar(@RequestBody RegisterRequest usuario) {
        try {
        	Usuarios nuevo = new Usuarios();
        	nuevo.setContrasena(usuario.getContrasena());
        	nuevo.setEmail(usuario.getEmail());
        	nuevo.setNombre(usuario.getNombre());
        	nuevo.setUsername(usuario.getNombreUsuario());
        	usuarioService.registrarUsuario(nuevo);
        	
            return ResponseEntity.ok("Usuario registrado con el nombre de usuario: " + nuevo.getUsername());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuarios usuario) {
        try {
        	return null;
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
