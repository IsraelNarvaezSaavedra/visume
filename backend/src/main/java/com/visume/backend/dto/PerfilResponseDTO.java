package com.visume.backend.dto;

import com.visume.backend.entities.Rol;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PerfilResponseDTO {
    private String username;
    private String email;
    private String nombre;
    private String profesion;
    private String fotoUrl;
    private LocalDateTime fechaRegistro;
    private boolean estaPagando;
    private Rol rol;
    private int maxCurriculums;
    private List<CurriculumResumenDTO> curriculums;

    @Data
    public static class CurriculumResumenDTO {
        private Integer id;
        private String titulo;
        private LocalDateTime fechaCreacion;
        private boolean publicado;
        private String urlWeb;
    }
}