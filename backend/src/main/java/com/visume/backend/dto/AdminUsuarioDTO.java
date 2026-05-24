package com.visume.backend.dto;

import com.visume.backend.entities.Rol;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminUsuarioDTO {
    private String username;
    private String email;
    private String nombre;
    private Rol rol;
    private boolean estaPagando;
    private LocalDateTime fechaRegistro;
    private int numCurriculums;
}
