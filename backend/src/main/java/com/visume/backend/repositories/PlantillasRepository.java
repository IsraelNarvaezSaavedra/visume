package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.Plantillas;

@Repository
public interface PlantillasRepository extends JpaRepository<Plantillas, Integer> {

}
