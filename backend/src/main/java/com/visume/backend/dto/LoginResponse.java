package com.visume.backend.dto;

import java.time.LocalDateTime;

import com.visume.backend.entities.Rol;

public class LoginResponse {
    
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
    
    // Constructor vacío
    public LoginResponse() {
    }
    
    // Constructor con parámetros
    public LoginResponse(String nombreUsuario, String email, String nombre, String profesion,
                        LocalDateTime fechaRegistro, boolean estaPagando, Rol rol,
                        String fotoUrl, String mensaje, boolean exitoso) {
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.nombre = nombre;
        this.profesion = profesion;
        this.fechaRegistro = fechaRegistro;
        this.estaPagando = estaPagando;
        this.rol = rol;
        this.fotoUrl = fotoUrl;
        this.mensaje = mensaje;
        this.exitoso = exitoso;
    }
    
    // Getters y Setters
    public String getNombreUsuario() {
        return nombreUsuario;
    }
    
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getProfesion() {
        return profesion;
    }
    
    public void setProfesion(String profesion) {
        this.profesion = profesion;
    }
    
    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    
    public boolean isEstaPagando() {
        return estaPagando;
    }
    
    public void setEstaPagando(boolean estaPagando) {
        this.estaPagando = estaPagando;
    }
    
    public Rol getRol() {
        return rol;
    }
    
    public void setRol(Rol rol) {
        this.rol = rol;
    }
    
    public String getFotoUrl() {
        return fotoUrl;
    }
    
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
    
    public String getMensaje() {
        return mensaje;
    }
    
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
    
    public boolean isExitoso() {
        return exitoso;
    }
    
    public void setExitoso(boolean exitoso) {
        this.exitoso = exitoso;
    }
}
