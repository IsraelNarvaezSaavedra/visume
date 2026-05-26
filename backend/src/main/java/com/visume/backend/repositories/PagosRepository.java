package com.visume.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.visume.backend.entities.Pagos;

import java.util.Optional;

@Repository
public interface PagosRepository extends JpaRepository<Pagos, Integer> {

	Optional<Pagos> findByTransaccionId(String transaccionId);

}
