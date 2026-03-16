package com.visume.backend.entities;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "plantillas")
public class Plantillas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plantilla")
    private Integer idPlantilla;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "preview_url", length = 255)
    private String previewUrl;

    @Column(name = "css_json", columnDefinition = "TEXT")
    private String cssJson;

    @Column(name = "activa", nullable = false)
    private boolean activa;

    @Column(name = "creada_en", nullable = false)
    private LocalDateTime creadaEn;

    // Relaciones OneToMany
    @OneToMany(mappedBy = "plantilla")
    private List<Curriculums> curriculums;

    // Getters y Setters
    public Integer getIdPlantilla() {
        return idPlantilla;
    }

    public void setIdPlantilla(Integer idPlantilla) {
        this.idPlantilla = idPlantilla;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getPreviewUrl() {
        return previewUrl;
    }

    public void setPreviewUrl(String previewUrl) {
        this.previewUrl = previewUrl;
    }

    public String getCssJson() {
        return cssJson;
    }

    public void setCssJson(String cssJson) {
        this.cssJson = cssJson;
    }

    public boolean isActiva() {
        return activa;
    }

    public void setActiva(boolean activa) {
        this.activa = activa;
    }

    public LocalDateTime getCreadaEn() {
        return creadaEn;
    }

    public void setCreadaEn(LocalDateTime creadaEn) {
        this.creadaEn = creadaEn;
    }

    public List<Curriculums> getCurriculums() {
        return curriculums;
    }

    public void setCurriculums(List<Curriculums> curriculums) {
        this.curriculums = curriculums;
    }
}
