package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.CurriculumsMetadatos;

@Repository
public interface CurriculumsMetadatosRepository extends JpaRepository<CurriculumsMetadatos, Integer> {

}
