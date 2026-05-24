package com.visume.backend.service;

import com.visume.backend.dto.AdminCurriculumDTO;
import com.visume.backend.dto.AdminUsuarioDTO;
import com.visume.backend.entities.Rol;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.CurriculumsRepository;
import com.visume.backend.repositories.UsuariosRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UsuariosRepository usuariosRepo;
    private final CurriculumsRepository curriculumsRepo;

    public AdminService(UsuariosRepository usuariosRepo, CurriculumsRepository curriculumsRepo) {
        this.usuariosRepo = usuariosRepo;
        this.curriculumsRepo = curriculumsRepo;
    }

    public List<AdminUsuarioDTO> listarUsuarios() {
        return usuariosRepo.findAll().stream().map(usuario -> {
            AdminUsuarioDTO dto = new AdminUsuarioDTO();
            dto.setUsername(usuario.getUsername());
            dto.setEmail(usuario.getEmail());
            dto.setNombre(usuario.getNombre());
            dto.setRol(usuario.getRol());
            dto.setEstaPagando(usuario.isEstaPagando());
            dto.setFechaRegistro(usuario.getFechaRegistro());
            dto.setNumCurriculums(usuario.getCurriculums() != null ? usuario.getCurriculums().size() : 0);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void actualizarUsuario(String username, String roleStr, Boolean estaPagando) {
        Usuarios usuario = usuariosRepo.findById(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (roleStr != null) {
            try {
                usuario.setRol(Rol.valueOf(roleStr));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Rol no válido");
            }
        }
        
        if (estaPagando != null) {
            usuario.setEstaPagando(estaPagando);
        }
        
        usuariosRepo.save(usuario);
    }

    @Transactional
    public void eliminarUsuario(String username) {
        if (!usuariosRepo.existsById(username)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuariosRepo.deleteById(username);
    }

    public List<AdminCurriculumDTO> listarCurriculums() {
        return curriculumsRepo.findAll().stream().map(c -> {
            AdminCurriculumDTO dto = new AdminCurriculumDTO();
            dto.setId(c.getIdCurriculum());
            dto.setTitulo(c.getTitulo());
            dto.setFechaCreacion(c.getFechaCreacion());
            dto.setUsername(c.getUsuario().getUsername());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void eliminarCurriculum(Integer id) {
        if (!curriculumsRepo.existsById(id)) {
            throw new RuntimeException("Curriculum no encontrado");
        }
        curriculumsRepo.deleteById(id);
    }
}
