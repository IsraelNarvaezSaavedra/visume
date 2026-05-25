package com.visume.backend.repositories;

import com.visume.backend.entities.CurriculumFotos;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CurriculumFotosRepository extends JpaRepository<CurriculumFotos, Integer> {
    List<CurriculumFotos> findByCurriculumIdCurriculumOrderByOrdenAsc(Integer idCurriculum);

    int countByCurriculumIdCurriculum(Integer idCurriculum);

    int countByCurriculumIdCurriculumAndEsPrincipalFalse(Integer idCurriculum);

    int countByCurriculumIdCurriculumAndEsPrincipalTrue(Integer idCurriculum);

    Optional<CurriculumFotos> findByCurriculumIdCurriculumAndEsPrincipalTrue(Integer idCurriculum);
}