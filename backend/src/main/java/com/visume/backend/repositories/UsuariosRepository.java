package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.Usuarios;

@Repository
public interface UsuariosRepository extends JpaRepository<Usuarios, String> {

}
