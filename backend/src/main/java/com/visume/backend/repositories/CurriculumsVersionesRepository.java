package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.CurriculumsVersiones;

@Repository
public interface CurriculumsVersionesRepository extends JpaRepository<CurriculumsVersiones, Integer> {

}
