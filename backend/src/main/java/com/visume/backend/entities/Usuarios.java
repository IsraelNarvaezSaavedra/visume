package com.visume.backend.entities;

import lombok.Getter;
import lombok.Setter;

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

@Getter
@Setter
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
    
    
}
