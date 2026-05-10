package com.visume.backend.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "prompts")
public class Prompts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prompt")
    private Integer idPrompt;

    @ManyToOne
    @JoinColumn(name = "nombre_usuario", nullable = false, foreignKey = @ForeignKey(name = "fk_prompts_usuarios"))
    private Usuarios usuario;

    @Column(name = "contenido", columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    // Relaciones OneToMany
    @OneToMany(mappedBy = "prompt")
    private List<Curriculums> curriculums;

    
}
