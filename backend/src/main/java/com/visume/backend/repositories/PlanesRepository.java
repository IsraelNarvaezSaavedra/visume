package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.Planes;

import java.util.Optional;

@Repository
public interface PlanesRepository extends JpaRepository<Planes, Integer> {

	Optional<Planes> findByNombreIgnoreCase(String nombre);

}
