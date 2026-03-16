package com.visume.backend.entities;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

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

    @Column(name = "url_web", length = 255, unique = true)
    private String urlWeb;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "publicado", nullable = false)
    private boolean publicado;

    @Column(name = "idioma", length = 2, nullable = false)
    private String idioma;

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

    // Getters y Setters
    public Integer getIdCurriculum() {
        return idCurriculum;
    }

    public void setIdCurriculum(Integer idCurriculum) {
        this.idCurriculum = idCurriculum;
    }

    public Prompts getPrompt() {
        return prompt;
    }

    public void setPrompt(Prompts prompt) {
        this.prompt = prompt;
    }

    public Usuarios getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuario = usuario;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public String getUrlWeb() {
        return urlWeb;
    }

    public void setUrlWeb(String urlWeb) {
        this.urlWeb = urlWeb;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public boolean isPublicado() {
        return publicado;
    }

    public void setPublicado(boolean publicado) {
        this.publicado = publicado;
    }

    public String getIdioma() {
        return idioma;
    }

    public void setIdioma(String idioma) {
        this.idioma = idioma;
    }

    public Plantillas getPlantilla() {
        return plantilla;
    }

    public void setPlantilla(Plantillas plantilla) {
        this.plantilla = plantilla;
    }

    public List<CurriculumsVersiones> getVersiones() {
        return versiones;
    }

    public void setVersiones(List<CurriculumsVersiones> versiones) {
        this.versiones = versiones;
    }

    public List<CurriculumSecciones> getSecciones() {
        return secciones;
    }

    public void setSecciones(List<CurriculumSecciones> secciones) {
        this.secciones = secciones;
    }

    public CurriculumsMetadatos getMetadatos() {
        return metadatos;
    }

    public void setMetadatos(CurriculumsMetadatos metadatos) {
        this.metadatos = metadatos;
    }
}
