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

    
}
