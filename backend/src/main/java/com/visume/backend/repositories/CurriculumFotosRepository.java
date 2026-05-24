package com.visume.backend.repositories;

import com.visume.backend.entities.CurriculumFotos;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CurriculumFotosRepository extends JpaRepository<CurriculumFotos, Integer> {
    List<CurriculumFotos> findByCurriculumIdCurriculumOrderByOrdenAsc(Integer idCurriculum);
    int countByCurriculumIdCurriculum(Integer idCurriculum);
}