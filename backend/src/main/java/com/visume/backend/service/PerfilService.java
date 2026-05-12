package com.visume.backend.service;

import com.visume.backend.dto.ActualizarPerfilDTO;
import com.visume.backend.dto.PerfilResponseDTO;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.CurriculumsRepository;
import com.visume.backend.repositories.UsuariosRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class PerfilService {

    private final UsuariosRepository usuariosRepo;
    private final CurriculumsRepository curriculumsRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public PerfilService(UsuariosRepository usuariosRepo, CurriculumsRepository curriculumsRepo) {
        this.usuariosRepo = usuariosRepo;
        this.curriculumsRepo = curriculumsRepo;
    }

    public PerfilResponseDTO obtenerPerfil(String username) {
        Usuarios usuario = usuariosRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PerfilResponseDTO dto = new PerfilResponseDTO();
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setNombre(usuario.getNombre());
        dto.setProfesion(usuario.getProfesion());
        dto.setFotoUrl(usuario.getFotoUrl());
        dto.setFechaRegistro(usuario.getFechaRegistro());
        dto.setEstaPagando(usuario.isEstaPagando());
        dto.setRol(usuario.getRol());
        dto.setMaxCurriculums(usuario.isEstaPagando() ? 3 : 1);

        var curriculums = curriculumsRepo.findByUsuarioOrderByFechaCreacionDesc(usuario)
                .stream().map(c -> {
                    PerfilResponseDTO.CurriculumResumenDTO r = new PerfilResponseDTO.CurriculumResumenDTO();
                    r.setId(c.getIdCurriculum());
                    r.setTitulo(c.getTitulo());
                    r.setFechaCreacion(c.getFechaCreacion());
                    r.setPublicado(c.isPublicado());
                    r.setUrlWeb(c.getUrlWeb());
                    return r;
                }).collect(Collectors.toList());

        dto.setCurriculums(curriculums);
        return dto;
    }

    @Transactional
    public void actualizarPerfil(String username, ActualizarPerfilDTO dto) {
        Usuarios usuario = usuariosRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (dto.getNombre() != null && !dto.getNombre().isBlank())
            usuario.setNombre(dto.getNombre());

        if (dto.getEmail() != null && !dto.getEmail().isBlank())
            usuario.setEmail(dto.getEmail());

        if (dto.getProfesion() != null)
            usuario.setProfesion(dto.getProfesion());

        if (dto.getContrasenaActual() != null && dto.getContrasenaNueva() != null) {
            if (!encoder.matches(dto.getContrasenaActual(), usuario.getContrasena()))
                throw new RuntimeException("La contraseña actual no es correcta");
            usuario.setContrasena(encoder.encode(dto.getContrasenaNueva()));
        }

        usuariosRepo.save(usuario);
    }

    @Transactional
    public void eliminarCurriculum(String username, Integer curriculumId) {
        Usuarios usuario = usuariosRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        var curriculum = curriculumsRepo.findById(curriculumId)
                .orElseThrow(() -> new RuntimeException("Curriculum no encontrado"));

        if (!curriculum.getUsuario().getUsername().equals(username))
            throw new RuntimeException("No tienes permiso para eliminar este curriculum");

        curriculumsRepo.delete(curriculum);
    }
}