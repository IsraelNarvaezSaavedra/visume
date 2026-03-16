package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.Curriculums;

@Repository
public interface CurriculumsRepository extends JpaRepository<Curriculums, Integer> {

}
