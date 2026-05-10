package com.visume.backend.dto;

import java.time.LocalDateTime;
import com.visume.backend.entities.Rol;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String nombreUsuario;
    private String email;
    private String nombre;
    private String profesion;
    private LocalDateTime fechaRegistro;
    private boolean estaPagando;
    private Rol rol;
    private String fotoUrl;
    private String mensaje;
    private boolean exitoso;
}