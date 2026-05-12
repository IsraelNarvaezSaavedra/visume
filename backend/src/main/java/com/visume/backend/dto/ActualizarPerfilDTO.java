package com.visume.backend.dto;

import lombok.Data;

@Data
public class ActualizarPerfilDTO {
    private String nombre;
    private String email;
    private String profesion;
    private String contrasenaActual;
    private String contrasenaNueva;
}