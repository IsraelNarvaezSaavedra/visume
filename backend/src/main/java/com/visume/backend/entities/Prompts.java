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
import jakarta.persistence.Table;

@Entity
@Table(name = "prompts")
public class Prompts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prompt")
    private Integer idPrompt;
/*
    @ManyToOne
    @JoinColumn(name = "nombre_usuario", nullable = false, foreignKey = @ForeignKey(name = "fk_prompts_usuarios"))
    private Usuarios usuario;*/

    @Column(name = "contenido", columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    // Relaciones OneToMany
    @OneToMany(mappedBy = "prompt")
    private List<Curriculums> curriculums;

    // Getters y Setters
    public Integer getIdPrompt() {
        return idPrompt;
    }

    public void setIdPrompt(Integer idPrompt) {
        this.idPrompt = idPrompt;
    }
/*
    public Usuarios getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuario = usuario;
    }
*/
    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(LocalDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }

    public List<Curriculums> getCurriculums() {
        return curriculums;
    }

    public void setCurriculums(List<Curriculums> curriculums) {
        this.curriculums = curriculums;
    }
}
