package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.CurriculumSecciones;

@Repository
public interface CurriculumSeccionesRepository extends JpaRepository<CurriculumSecciones, Integer> {

}
