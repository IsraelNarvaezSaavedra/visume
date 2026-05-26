package com.visume.backend.config;

import com.visume.backend.entities.Planes;
import com.visume.backend.repositories.PlanesRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class SeedDataConfig {

    @Bean
    CommandLineRunner seedPlanes(PlanesRepository planesRepository) {
        return args -> {
            if (planesRepository.findByNombreIgnoreCase("Free").isEmpty()) {
                Planes free = new Planes();
                free.setNombre("Free");
                free.setPrecio(BigDecimal.ZERO);
                free.setMetodoPago("free");
                free.setDescripcion("Plan gratuito base");
                free.setMaxCurriculums(1);
                free.setMaxFotosCv(0);
                free.setCreadoEn(LocalDateTime.now());
                planesRepository.save(free);
            }

            if (planesRepository.findByNombreIgnoreCase("Premium").isEmpty()) {
                Planes premium = new Planes();
                premium.setNombre("Premium");
                premium.setPrecio(new BigDecimal("0.00"));
                premium.setMetodoPago("stripe");
                premium.setDescripcion("Plan premium");
                premium.setMaxCurriculums(3);
                premium.setMaxFotosCv(6);
                premium.setCreadoEn(LocalDateTime.now());
                planesRepository.save(premium);
            }
        };
    }
}