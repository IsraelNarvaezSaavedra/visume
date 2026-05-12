package com.visume.backend.repositories;

import com.visume.backend.entities.Curriculums;
import com.visume.backend.entities.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CurriculumsRepository extends JpaRepository<Curriculums, Integer> {
    List<Curriculums> findByUsuarioOrderByFechaCreacionDesc(Usuarios usuario);
    long countByUsuario(Usuarios usuario);

    @Modifying
    @Query("DELETE FROM Curriculums c WHERE c.idCurriculum = (SELECT MIN(c2.idCurriculum) FROM Curriculums c2 WHERE c2.usuario = :usuario)")
    void deleteOldestByUsuario(Usuarios usuario);
}