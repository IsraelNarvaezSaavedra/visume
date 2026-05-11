package com.visume.backend.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "curriculums_metadatos")
public class CurriculumsMetadatos {

    @Id
    @Column(name = "curriculum_id")
    private Integer curriculumId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "curriculum_id", nullable = false, foreignKey = @ForeignKey(name = "fk_metadatos_curriculums"))
    private Curriculums curriculum;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Column(name = "sector", length = 100)
    private String sector;

    @Column(name = "anos_experiencia")
    private Integer anosExperiencia;

    @Column(name = "nivel_ingles", length = 20)
    private String nivelIngles;

    @Column(name = "ubicacion", length = 100)
    private String ubicacion;

    @Column(name = "palabras_clave", columnDefinition = "TEXT")
    private String palabrasClave;

    @Column(name = "ultima_extraccion", nullable = false)
    private LocalDateTime ultimaExtraccion;

    
}
