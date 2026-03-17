package com.visume.backend.service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.UsuariosRepository;

@Service
public class UsuariosService {
	private final UsuariosRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UsuariosService(UsuariosRepository repository) {
        this.repository = repository;
    }

    public Usuarios registrarUsuario(Usuarios usuario) {
        if (repository.existsByUsername(usuario.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está registrado");
        }
        usuario.setContrasena(encoder.encode(usuario.getContrasena()));
        return repository.save(usuario);
    }
}
