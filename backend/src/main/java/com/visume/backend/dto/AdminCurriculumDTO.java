package com.visume.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminCurriculumDTO {
    private Integer id;
    private String titulo;
    private LocalDateTime fechaCreacion;
    private String username;
}
