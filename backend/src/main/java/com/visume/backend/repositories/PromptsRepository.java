package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.Prompts;

@Repository
public interface PromptsRepository extends JpaRepository<Prompts, Integer> {

}
