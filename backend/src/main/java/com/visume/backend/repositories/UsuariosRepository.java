package com.visume.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.Usuarios;

@Repository
public interface UsuariosRepository extends JpaRepository<Usuarios, String> {
    
    /**
     * Busca un usuario por email
     * @param email Email del usuario
     * @return Optional con el usuario si existe
     */
    Optional<Usuarios> findByUsername(String username);
    boolean existsByUsername(String username);
}

