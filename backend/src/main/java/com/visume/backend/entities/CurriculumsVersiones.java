package com.visume.backend.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Getter
@Setter
@Entity
@Table(name = "curriculums_versiones", uniqueConstraints = {
    @UniqueConstraint(name = "uk_version", columnNames = {"curriculum_id", "numero_version"})
})
public class CurriculumsVersiones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_version")
    private Integer idVersion;

    @ManyToOne
    @JoinColumn(name = "curriculum_id", nullable = false, foreignKey = @ForeignKey(name = "fk_versiones_curriculums"))
    private Curriculums curriculum;

    @Column(name = "numero_version", nullable = false)
    private Integer numeroVersion;

    @Column(name = "contenido", columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @Column(name = "cambios_resumen", columnDefinition = "TEXT")
    private String cambiosResumen;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    @Column(name = "creado_por", length = 50)
    private String creadoPor;

    
}
