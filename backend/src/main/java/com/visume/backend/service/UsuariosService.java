package com.visume.backend.service;

import com.visume.backend.dto.LoginRequest;
import com.visume.backend.dto.LoginResponse;
import com.visume.backend.dto.RegisterRequest;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.UsuariosRepository;
import com.visume.backend.utils.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuariosService {

    private final UsuariosRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    public UsuariosService(UsuariosRepository repository, JwtUtil jwtUtil) {
        this.repository = repository;
        this.jwtUtil = jwtUtil;
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
        Usuarios usuario = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email no encontrado"));

        if (!encoder.matches(dto.getContrasena(), usuario.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtUtil.generarToken(usuario.getUsername());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setNombreUsuario(usuario.getUsername());
        response.setEmail(usuario.getEmail());
        response.setNombre(usuario.getNombre());
        response.setRol(usuario.getRol());
        response.setEstaPagando(usuario.isEstaPagando());
        response.setMensaje("Login exitoso");
        response.setExitoso(true);

        return response;
    }
}