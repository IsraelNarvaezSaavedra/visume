package com.visume.backend.service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.visume.backend.dto.LoginRequest;
import com.visume.backend.dto.LoginResponse;
import com.visume.backend.dto.RegisterRequest;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.UsuariosRepository;

@Service
public class UsuariosService {
	private final UsuariosRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UsuariosService(UsuariosRepository repository) {
        this.repository = repository;
    }

    public Usuarios registrarUsuario(RegisterRequest dto) {
    	
        if (repository.existsByUsername(dto.getNombreUsuario())) {
            throw new RuntimeException("El nombre de usuario ya está registrado");
        }

        Usuarios usuario = new Usuarios();
        usuario.setUsername(dto.getNombreUsuario());
        usuario.setEmail(dto.getEmail());
        usuario.setNombre(dto.getNombre());
        
        usuario.setContrasena(encoder.encode(dto.getContrasena()));

        return repository.save(usuario);
    }
    
    public LoginResponse loguearUsuario(LoginRequest dto) {
    	Usuarios usuario = repository.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("El email no encontrado"));
    	
        if (!encoder.matches(dto.getContrasena(), usuario.getContrasena())) {
			throw new RuntimeException("Contraseña incorrecta");
		}
        
        LoginResponse response = new LoginResponse();
        response.setNombreUsuario(usuario.getUsername());
        response.setEmail(usuario.getEmail());
        response.setRol(usuario.getRol());
        //response.setFotoUrl(usuario.getFotoUrl());
        response.setMensaje("Login exitoso");
        response.setExitoso(true);
        
        return response;
    }
    
}

