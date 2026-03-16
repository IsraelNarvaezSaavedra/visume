package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.Sesiones;

@Repository
public interface SesionesRepository extends JpaRepository<Sesiones, String> {

}
