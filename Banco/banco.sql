-- =====================================================================
-- AgroTech - banco de dados
-- Compatível com MySQL 8 e MariaDB.
-- Como importar:  mysql -u root -p < banco.sql
-- ATENÇÃO: recria as tabelas do banco "agrotech" (apaga dados existentes).
-- =====================================================================

CREATE DATABASE IF NOT EXISTS agrotech
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE agrotech;

-- Apaga primeiro a tabela filha, depois as tabelas referenciadas
DROP TABLE IF EXISTS plantausuario;
DROP TABLE IF EXISTS plantaadm;
DROP TABLE IF EXISTS usuarios;

-- ---------------------------------------------------------------------
-- Usuários
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    idUsuario INT NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(100) NOT NULL,
    email     VARCHAR(100) NOT NULL,
    senha     VARCHAR(255) NOT NULL,
    role      ENUM('user','adm') NOT NULL DEFAULT 'user',
    PRIMARY KEY (idUsuario),
    UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Catálogo de plantas (tempo de colheita em dias)
-- tipoPlanta é único para poder ser referenciado por plantausuario
-- ---------------------------------------------------------------------
CREATE TABLE plantaadm (
    id              INT NOT NULL AUTO_INCREMENT,
    tipoPlanta      VARCHAR(40) NOT NULL,
    tempoDeColheita INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_plantaadm_tipo (tipoPlanta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Plantios dos usuários
-- Ao excluir um usuário, os plantios dele são apagados junto (CASCADE)
-- ---------------------------------------------------------------------
CREATE TABLE plantausuario (
    idPlanta       INT NOT NULL AUTO_INCREMENT,
    idUsuario      INT NOT NULL,
    planta         VARCHAR(45) NOT NULL,
    tipoPlanta     VARCHAR(40) NOT NULL,
    safraNumero    INT NOT NULL,
    safraNome      VARCHAR(300) NOT NULL,
    quantidade     INT NOT NULL,
    longitude      DECIMAL(9,6) NOT NULL,
    latitude       DECIMAL(9,6) NOT NULL,
    data_plantacao DATE NOT NULL,
    agrotoxico     ENUM('sim','nao') NOT NULL,
    comentarios    TEXT,
    url            VARCHAR(500) DEFAULT NULL,
    PRIMARY KEY (idPlanta),
    CONSTRAINT fk_plantausuario_usuario
        FOREIGN KEY (idUsuario) REFERENCES usuarios (idUsuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_plantausuario_tipo
        FOREIGN KEY (tipoPlanta) REFERENCES plantaadm (tipoPlanta)
        ON UPDATE CASCADE,
    CONSTRAINT chk_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT chk_longitude CHECK (longitude BETWEEN -180 AND 180),
    CONSTRAINT chk_quantidade_positiva CHECK (quantidade > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Dados iniciais
-- ---------------------------------------------------------------------
INSERT INTO plantaadm (id, tipoPlanta, tempoDeColheita) VALUES
    (1,  'morangoAlbion',       38),
    (2,  'morangoCaminoReal',   44),
    (3,  'morangoSanAndreas',   34),
    (4,  'cenouraTradicional',  55),
    (5,  'pepinoCaipira',       43),
    (6,  'pepinoConserva',      56),
    (7,  'pepinoJapones',       63),
    (8,  'tomateCereja',        18),
    (9,  'tomateLongaVida',     22),
    (10, 'tomateSaladete',      24);

-- Contas de teste (as senhas estão documentadas no README)
INSERT INTO usuarios (idUsuario, nome, email, senha, role) VALUES
    (1, 'usuarioteste', 'usuario@gmail.com', '$2b$10$1V4lXlLojdhDA6CyD2Cl6OnaZkquVuA5ooIYbFq89liaIy77Ct6Wm', 'user'),
    (2, 'adm',          'admin@gmail.com',   '$2b$10$F0YgWkbcwIEPxYAKuFyi0ehs1NzopXQvy1Xeb8AmxZMTglvG1zDw2', 'adm');