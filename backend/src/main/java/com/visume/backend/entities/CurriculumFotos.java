package com.visume.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "curriculum_fotos")
public class CurriculumFotos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_foto")
    private Integer idFoto;

    @ManyToOne
    @JoinColumn(name = "id_curriculum", nullable = false,
                foreignKey = @ForeignKey(name = "fk_fotos_curriculums"))
    private Curriculums curriculum;

    @Column(name = "url", length = 255, nullable = false)
    private String url;

    @Column(name = "es_principal", nullable = false)
    private boolean esPrincipal = false;

    @Column(name = "orden")
    private Integer orden = 0;

    @Column(name = "subida_en", nullable = false)
    private LocalDateTime subidaEn = LocalDateTime.now();
}