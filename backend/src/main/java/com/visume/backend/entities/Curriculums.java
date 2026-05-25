package com.visume.backend.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "curriculums")
public class Curriculums {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curriculum")
    private Integer idCurriculum;

    @ManyToOne
    @JoinColumn(name = "id_prompt", nullable = false, foreignKey = @ForeignKey(name = "fk_curriculums_prompts"))
    private Prompts prompt;

    @ManyToOne
    @JoinColumn(name = "nombre_usuario", nullable = false, foreignKey = @ForeignKey(name = "fk_curriculums_usuarios"))
    private Usuarios usuario;

    @Column(name = "titulo", length = 150, nullable = false)
    private String titulo;

    @Column(name = "contenido", columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "share_code", length = 50, unique = true, nullable = true)
    private String shareCode;

    @OneToMany(mappedBy = "curriculum", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CurriculumFotos> fotos;

    @ManyToOne
    @JoinColumn(name = "id_plantilla", nullable = true, foreignKey = @ForeignKey(name = "fk_curriculums_plantillas"))
    private Plantillas plantilla;

    // Relaciones OneToMany
    @OneToMany(mappedBy = "curriculum")
    private List<CurriculumsVersiones> versiones;

    @OneToMany(mappedBy = "curriculum")
    private List<CurriculumSecciones> secciones;

    // Relación OneToOne con metadatos
    @OneToOne(mappedBy = "curriculum")
    private CurriculumsMetadatos metadatos;

}
