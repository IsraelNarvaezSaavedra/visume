package com.visume.backend.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Getter
@Setter
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

    
}
