-- 1. Plantas
CREATE TABLE plantas (
    id_planta SERIAL PRIMARY KEY,
    nome_planta VARCHAR(100) NOT NULL,
    nome_cientifico VARCHAR(150) NOT NULL,
    tipo_planta VARCHAR(50) NOT NULL,
    descricao_planta TEXT
);

-- 2. Culturas
CREATE TABLE culturas (
    id_cultura SERIAL PRIMARY KEY,
    planta_id INTEGER NOT NULL,
    hectares NUMERIC(10, 2) NOT NULL,
    data_plantio DATE NOT NULL,
    data_colheita DATE,
    FOREIGN KEY (planta_id) REFERENCES plantas(id_planta)
);

-- 3. Manejos
CREATE TABLE manejos (
    id_manejo SERIAL PRIMARY KEY,
    cultura_id INTEGER NOT NULL,
    tipo_manejo VARCHAR(50) NOT NULL,
    descricao_manejo TEXT,
    data_manejo DATE NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (cultura_id) REFERENCES culturas(id_cultura)
);