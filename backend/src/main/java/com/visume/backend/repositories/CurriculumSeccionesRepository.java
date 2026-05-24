package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.CurriculumSecciones;
import com.visume.backend.entities.Curriculums;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumSeccionesRepository extends JpaRepository<CurriculumSecciones, Integer> {

    Optional<CurriculumSecciones> findByCurriculumAndTipoSeccion(Curriculums curriculum, String tipoSeccion);
    List<CurriculumSecciones> findByCurriculum(Curriculums curriculum);
}
