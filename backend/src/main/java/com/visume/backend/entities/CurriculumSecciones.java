package com.visume.backend.entities;

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

@Entity
@Table(name = "curriculum_secciones", uniqueConstraints = {
    @UniqueConstraint(name = "uk_seccion_orden", columnNames = {"curriculum_id", "tipo_seccion", "orden"})
})
public class CurriculumSecciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "curriculum_id", nullable = false, foreignKey = @ForeignKey(name = "fk_secciones_curriculums"))
    private Curriculums curriculum;

    @Column(name = "tipo_seccion", length = 50, nullable = false)
    private String tipoSeccion;

    @Column(name = "orden", nullable = false)
    private Integer orden;

    @Column(name = "titulo_seccion", length = 100)
    private String tituloSeccion;

    @Column(name = "datos", columnDefinition = "JSON", nullable = false)
    private String datos;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Curriculums getCurriculum() {
        return curriculum;
    }

    public void setCurriculum(Curriculums curriculum) {
        this.curriculum = curriculum;
    }

    public String getTipoSeccion() {
        return tipoSeccion;
    }

    public void setTipoSeccion(String tipoSeccion) {
        this.tipoSeccion = tipoSeccion;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    public String getTituloSeccion() {
        return tituloSeccion;
    }

    public void setTituloSeccion(String tituloSeccion) {
        this.tituloSeccion = tituloSeccion;
    }

    public String getDatos() {
        return datos;
    }

    public void setDatos(String datos) {
        this.datos = datos;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(LocalDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }

    public LocalDateTime getActualizadoEn() {
        return actualizadoEn;
    }

    public void setActualizadoEn(LocalDateTime actualizadoEn) {
        this.actualizadoEn = actualizadoEn;
    }
}
