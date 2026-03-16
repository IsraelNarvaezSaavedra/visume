package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.Planes;

@Repository
public interface PlanesRepository extends JpaRepository<Planes, Integer> {

}
