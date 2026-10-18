const { query } = require('../configDB'); 
const Planta = require('../entities/Plantas');

const getPlantasDB = async () => {
    try {
        const { rows } = await query(
            'SELECT * FROM plantas ORDER BY nome_planta'
        );

        return rows.map(
            (planta) => new Planta(
                planta.id_planta,
                planta.nome_planta,
                planta.nome_cientifico,
                planta.tipo_planta,
                planta.descricao_planta
            )
        );
    } catch (err) {
        throw "Erro : " + err;
    }
};

const addPlantaDB = async (body) => {
    try {
        const { nome_planta, nome_cientifico, tipo_planta, descricao_planta } = body;

        const results = await query(
            `INSERT INTO plantas (nome_planta, nome_cientifico, tipo_planta, descricao_planta)
             VALUES ($1, $2, $3, $4)
             RETURNING id_planta, nome_planta, nome_cientifico, tipo_planta, descricao_planta`,
            [nome_planta, nome_cientifico, tipo_planta, descricao_planta]
        );

        const planta = results.rows[0];

        return new Planta(
            planta.id_planta,
            planta.nome_planta,
            planta.nome_cientifico,
            planta.tipo_planta,
            planta.descricao_planta
        );
    } catch (err) {
        throw "Erro ao inserir a planta: " + err;
    }
};



const updatePlantaDB = async (body) => {
    try {
        //O id_planta vem via URL e é injetado no body pelo controller
        const { id_planta, nome_planta, nome_cientifico, tipo_planta, descricao_planta } = body;

        const results = await query(
            `UPDATE plantas
             SET nome_planta = $2, nome_cientifico = $3, tipo_planta = $4, descricao_planta = $5
             WHERE id_planta = $1
             RETURNING id_planta, nome_planta, nome_cientifico, tipo_planta, descricao_planta`,
            [id_planta, nome_planta, nome_cientifico, tipo_planta, descricao_planta]
        );

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${id_planta} para ser alterado`;
        }

        const planta = results.rows[0];

        return new Planta(
            planta.id_planta,
            planta.nome_planta,
            planta.nome_cientifico,
            planta.tipo_planta,
            planta.descricao_planta
        );
    } catch (err) {
        throw "Erro ao alterar a planta: " + err;
    }
};


const deletePlantaDB = async (codigo) => {
    try {
        const results = await query(
            `DELETE FROM plantas
             WHERE id_planta = $1`,
            [codigo]
        );

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
        } else {
            return "Planta removida com sucesso";
        }
    } catch (err) {
        throw "Erro ao remover a planta: " + err;
    }
};

const getPlantaPorCodigoDB = async (codigo) => {
    try {
        const results = await query(
            `SELECT * FROM plantas
             WHERE id_planta = $1`,
            [codigo]
        );

        if (results.rowCount == 0) {
            throw "Nenhum registro encontrado com o código: " + codigo;
        } else {
            const planta = results.rows[0];

            return new Planta(
                planta.id_planta,
                planta.nome_planta,
                planta.nome_cientifico,
                planta.tipo_planta,
                planta.descricao_planta
            );
        }
                
    } catch (err) {
        throw "Erro ao recuperar a planta: " + err;
    }
};

module.exports = {
    getPlantasDB,
    addPlantaDB,
    updatePlantaDB,
    deletePlantaDB,
    getPlantaPorCodigoDB
};