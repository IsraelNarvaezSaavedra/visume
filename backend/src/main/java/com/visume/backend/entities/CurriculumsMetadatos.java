package com.visume.backend.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "curriculums_metadatos")
public class CurriculumsMetadatos {

    @Id
    @Column(name = "curriculum_id")
    private Integer curriculumId;

    @OneToOne
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

    // Getters y Setters
    public Integer getCurriculumId() {
        return curriculumId;
    }

    public void setCurriculumId(Integer curriculumId) {
        this.curriculumId = curriculumId;
    }

    public Curriculums getCurriculum() {
        return curriculum;
    }

    public void setCurriculum(Curriculums curriculum) {
        this.curriculum = curriculum;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public Integer getAnosExperiencia() {
        return anosExperiencia;
    }

    public void setAnosExperiencia(Integer anosExperiencia) {
        this.anosExperiencia = anosExperiencia;
    }

    public String getNivelIngles() {
        return nivelIngles;
    }

    public void setNivelIngles(String nivelIngles) {
        this.nivelIngles = nivelIngles;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getPalabrasClave() {
        return palabrasClave;
    }

    public void setPalabrasClave(String palabrasClave) {
        this.palabrasClave = palabrasClave;
    }

    public LocalDateTime getUltimaExtraccion() {
        return ultimaExtraccion;
    }

    public void setUltimaExtraccion(LocalDateTime ultimaExtraccion) {
        this.ultimaExtraccion = ultimaExtraccion;
    }
}
