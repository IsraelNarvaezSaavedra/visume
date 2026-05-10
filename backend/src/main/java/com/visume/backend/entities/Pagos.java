package com.visume.backend.entities;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
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

@Getter
@Setter
@Entity
@Table(name = "pagos")
public class Pagos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Integer idPago;

    @ManyToOne
    @JoinColumn(name = "nombre_usuario", nullable = false, foreignKey = @ForeignKey(name = "fk_pagos_usuarios"))
    private Usuarios usuario;

    @ManyToOne
    @JoinColumn(name = "id_plan", nullable = false, foreignKey = @ForeignKey(name = "fk_pagos_planes"))
    private Planes plan;

    @Column(name = "monto", precision = 10, scale = 2, nullable = false)
    private BigDecimal monto;

    @Column(name = "metodo_pago", length = 50, nullable = false)
    private String metodoPago;

    @Column(name = "estado", length = 20, nullable = false)
    private String estado;

    @Column(name = "fecha_pago", nullable = false)
    private LocalDateTime fechaPago;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "transaccion_id", length = 100, unique = true)
    private String transaccionId;

    @Column(name = "notas", columnDefinition = "TEXT")
    private String notas;

    
}
