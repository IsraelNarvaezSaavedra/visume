package com.visume.backend.entities;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
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
@Table(name = "planes")
public class Planes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plan")
    private Integer idPlan;

    @Column(name = "nombre", length = 60, nullable = false)
    private String nombre;

    @Column(name = "precio", precision = 8, scale = 2)
    private BigDecimal precio;

    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "max_curriculums", nullable = false)
    private Integer maxCurriculums = 1;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    // Relaciones OneToMany
    @OneToMany(mappedBy = "plan")
    private List<Usuarios> usuarios;

    @OneToMany(mappedBy = "plan")
    private List<Pagos> pagos;

}
