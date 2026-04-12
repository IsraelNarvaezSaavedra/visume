package com.visume.backend.entities;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuarios {

    @Id
    @Column(name = "nombre_usuario", length = 50)
    private String username;
    
    @Column(unique = true, nullable = false, length = 120)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String contrasena;
    
    @Column(name = "nombre", length = 100)
    private String nombre;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 20)
    private Rol rol = Rol.USUARIO;
    
    @Column(name = "esta_pagando", nullable = false)
    private boolean estaPagando = false;
    
    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro = LocalDateTime.now();
    
    @Column(name = "publicar_curriculum", nullable = true)
    private boolean publicarCurriculum;
    /*
    @Column(name = "profesion", length = 100)
    private String profesion;
    
    @ManyToOne
    @JoinColumn(name = "id_plan", nullable = true, foreignKey = @ForeignKey(name = "fk_usuarios_planes"))
    private Planes plan;
    
    @Column(name = "foto_url", length = 255)
    private String fotoUrl;
    
    @Column(name = "foto_actualizada")
    private LocalDateTime fotoActualizada;
    
    // Relaciones OneToMany
    @OneToMany(mappedBy = "usuario")
    private List<Prompts> prompts;
    
    @OneToMany(mappedBy = "usuario")
    private List<Curriculums> curriculums;
    
    @OneToMany(mappedBy = "usuario")
    private List<Pagos> pagos;
    */
    // Getters y Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
    
    
    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    
 /*
    public String getProfesion() {
        return profesion;
    }

    public void setProfesion(String profesion) {
        this.profesion = profesion;
    }

    

    public boolean isEstaPagando() {
        return estaPagando;
    }

    public void setEstaPagando(boolean estaPagando) {
        this.estaPagando = estaPagando;
    }

    public Planes getPlan() {
        return plan;
    }

    public void setPlan(Planes plan) {
        this.plan = plan;
    }

    public boolean isPublicarCurriculum() {
        return publicarCurriculum;
    }

    public void setPublicarCurriculum(boolean publicarCurriculum) {
        this.publicarCurriculum = publicarCurriculum;
    }


    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public LocalDateTime getFotoActualizada() {
        return fotoActualizada;
    }

    public void setFotoActualizada(LocalDateTime fotoActualizada) {
        this.fotoActualizada = fotoActualizada;
    }

    public List<Prompts> getPrompts() {
        return prompts;
    }

    public void setPrompts(List<Prompts> prompts) {
        this.prompts = prompts;
    }

    public List<Curriculums> getCurriculums() {
        return curriculums;
    }

    public void setCurriculums(List<Curriculums> curriculums) {
        this.curriculums = curriculums;
    }

    public List<Pagos> getPagos() {
        return pagos;
    }

    public void setPagos(List<Pagos> pagos) {
        this.pagos = pagos;
    }
	*/
}
