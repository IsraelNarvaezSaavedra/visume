USE visume;


-- 1. Tabla PLANES (base, no depende de nada)
CREATE TABLE IF NOT EXISTS planes (
    id_plan         INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(60) NOT NULL,
    precio          DECIMAL(8,2) DEFAULT 0.00,
    metodo_pago     VARCHAR(50) NULL,
    descripcion     TEXT NULL,
    creado_en       DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- 2. Tabla USUARIOS (solo depende de planes)
CREATE TABLE IF NOT EXISTS usuarios (
    nombre_usuario      VARCHAR(50) PRIMARY KEY,
    email               VARCHAR(120) NOT NULL UNIQUE,
    contrasena          VARCHAR(255) NOT NULL,
    nombre              VARCHAR(100) NULL,
    profesion           VARCHAR(100) NULL,
    fecha_registro      DATETIME DEFAULT CURRENT_TIMESTAMP,
    esta_pagando        BOOLEAN DEFAULT FALSE,
    id_plan             INT NULL,
    publicar_curriculum BOOLEAN DEFAULT FALSE,
    es_administrador    BOOLEAN DEFAULT FALSE,
    foto_url            VARCHAR(255) NULL,
    foto_actualizada    DATETIME NULL,

    FOREIGN KEY (id_plan) REFERENCES planes(id_plan)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- 3. Tabla PROMPTS (depende de usuarios)
CREATE TABLE IF NOT EXISTS prompts (
    id_prompt       INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario  VARCHAR(50) NOT NULL,
    contenido       TEXT NOT NULL,
    creado_en       DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (nombre_usuario) REFERENCES usuarios(nombre_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- 4. Tabla PLANTILLAS (independiente, pero la necesitan curriculums)
CREATE TABLE IF NOT EXISTS plantillas (
    id_plantilla    INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    descripcion     TEXT NULL,
    preview_url     VARCHAR(255) NULL,
    css_json        TEXT NULL,
    activa          BOOLEAN DEFAULT TRUE,
    creada_en       DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- 5. Tabla CURRICULUMS (depende de prompts + usuarios + plantillas)
CREATE TABLE IF NOT EXISTS curriculums (
    id_curriculum       INT AUTO_INCREMENT PRIMARY KEY,
    id_prompt           INT NOT NULL,
    nombre_usuario      VARCHAR(50) NOT NULL,
    titulo              VARCHAR(150) NOT NULL,
    contenido           TEXT NOT NULL,
    url_web             VARCHAR(255) NULL UNIQUE,
    fecha_creacion      DATETIME DEFAULT CURRENT_TIMESTAMP,
    publicado           BOOLEAN DEFAULT FALSE,
    idioma              CHAR(2) NOT NULL DEFAULT 'es',
    id_plantilla        INT NULL,

    FOREIGN KEY (id_prompt)      REFERENCES prompts(id_prompt)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (nombre_usuario) REFERENCES usuarios(nombre_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (id_plantilla)   REFERENCES plantillas(id_plantilla)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- 6. Tabla SESIONES (depende de usuarios)
CREATE TABLE IF NOT EXISTS sesiones (
    id_sesion           VARCHAR(100) PRIMARY KEY,
    nombre_usuario      VARCHAR(50) NOT NULL,
    fecha_hora_inicio   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_hora_fin      DATETIME NULL,
    ip                  VARCHAR(45) NULL,
    user_agent          VARCHAR(255) NULL,

    FOREIGN KEY (nombre_usuario) REFERENCES usuarios(nombre_usuario)
        ON DELETE CASCADE
);


-- 7. Tabla PAGOS (depende de usuarios + planes)
CREATE TABLE IF NOT EXISTS pagos (
    id_pago             INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario      VARCHAR(50) NOT NULL,
    id_plan             INT NOT NULL,
    monto               DECIMAL(10,2) NOT NULL,
    metodo_pago         VARCHAR(50) NOT NULL,
    estado              VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    fecha_pago          DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento   DATE NULL,
    transaccion_id      VARCHAR(100) NULL UNIQUE,
    notas               TEXT NULL,

    FOREIGN KEY (nombre_usuario) REFERENCES usuarios(nombre_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY (id_plan) REFERENCES planes(id_plan)
        ON DELETE RESTRICT
);


-- 8. Tabla METADATOS (depende de curriculums)
CREATE TABLE IF NOT EXISTS curriculums_metadatos (
    curriculum_id       INT PRIMARY KEY,
    skills              TEXT NULL,
    sector              VARCHAR(100) NULL,
    anos_experiencia    INT NULL,
    nivel_ingles        VARCHAR(20) NULL,
    ubicacion           VARCHAR(100) NULL,
    palabras_clave      TEXT NULL,
    ultima_extraccion   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (curriculum_id) REFERENCES curriculums(id_curriculum)
        ON DELETE CASCADE
);


-- 9. Tabla VERSIONES / HISTORIAL (depende de curriculums)
CREATE TABLE IF NOT EXISTS curriculums_versiones (
    id_version          INT AUTO_INCREMENT PRIMARY KEY,
    curriculum_id       INT NOT NULL,
    numero_version      INT NOT NULL,
    contenido           TEXT NOT NULL,
    cambios_resumen     TEXT NULL,
    creado_en           DATETIME DEFAULT CURRENT_TIMESTAMP,
    creado_por          VARCHAR(50) NULL,

    FOREIGN KEY (curriculum_id) REFERENCES curriculums(id_curriculum)
        ON DELETE CASCADE,

    UNIQUE KEY uk_version (curriculum_id, numero_version)
);


-- 10. Tabla SECCIONES (depende de curriculums)
CREATE TABLE IF NOT EXISTS curriculum_secciones (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    curriculum_id       INT NOT NULL,
    tipo_seccion        VARCHAR(50) NOT NULL,
    orden               INT NOT NULL DEFAULT 0,
    titulo_seccion      VARCHAR(100) NULL,
    datos               JSON NOT NULL,
    creado_en           DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (curriculum_id) REFERENCES curriculums(id_curriculum)
        ON DELETE CASCADE,

    UNIQUE KEY uk_seccion_orden (curriculum_id, tipo_seccion, orden)
);


-- Índices recomendados (no rompen nada, se pueden ejecutar siempre)
CREATE INDEX IF NOT EXISTS idx_curriculum_publicado ON curriculums(publicado, url_web);
CREATE INDEX IF NOT EXISTS idx_curriculum_usuario    ON curriculums(nombre_usuario);
CREATE INDEX IF NOT EXISTS idx_pagos_usuario         ON pagos(nombre_usuario);
