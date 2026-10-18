const { query } = require("../configDB");
const Cultura = require("../entities/Culturas");
const { formatarDataSimples, validarIntervaloDatas } = require('../utils/dateUtils');

const getCulturasDB = async () => {
  try {
    const { rows } = await query("SELECT * FROM culturas ORDER BY id_cultura");

    return rows.map(
      (cultura) =>
        new Cultura(
          cultura.id_cultura,
          cultura.planta_id,
          cultura.hectares,
          formatarDataSimples(cultura.data_plantio),
          formatarDataSimples(cultura.data_colheita),
        ),
    );
  } catch (err) {
    throw "Erro : " + err;
  }
};

const addCulturaDB = async (body) => {
  try {
    const { planta_id, hectares, data_plantio, data_colheita } = body;

    // Executa as validações antes da gravação
    validarIntervaloDatas(data_plantio, data_colheita);

    const results = await query(
      `INSERT INTO culturas (planta_id, hectares, data_plantio, data_colheita)
             VALUES ($1, $2, $3, $4)
             RETURNING id_cultura, planta_id, hectares, data_plantio, data_colheita`,
      [planta_id, hectares, data_plantio, data_colheita || null],
    );

    const cultura = results.rows[0];

    return new Cultura(
      cultura.id_cultura,
      cultura.planta_id,
      cultura.hectares,
      formatarDataSimples(cultura.data_plantio),
      formatarDataSimples(cultura.data_colheita),
    );
  } catch (err) {
    if (err.code === "23503") {
      throw `A planta com o código ${body.planta_id} não existe no cadastro.`;
    }
    // Se for um erro é lançado pelas validações de data, repassa diretamente a mensagem
    throw typeof err === "string" ? err : "Erro ao inserir a cultura: " + err;
  }
};

const updateCulturaDB = async (body) => {
  try {
    const { id_cultura, planta_id, hectares, data_plantio, data_colheita } = body;

    // Executa as validações antes da alteração
    validarIntervaloDatas(data_plantio, data_colheita);

    const results = await query(
      `UPDATE culturas
             SET planta_id = $2, hectares = $3, data_plantio = $4, data_colheita = $5
             WHERE id_cultura = $1
             RETURNING id_cultura, planta_id, hectares, data_plantio, data_colheita`,
      [id_cultura, planta_id, hectares, data_plantio, data_colheita || null],
    );

    if (results.rowCount == 0) {
      throw `Nenhum registro encontrado com o código ${id_cultura} para ser alterado`;
    }

    const cultura = results.rows[0];

    return new Cultura(
      cultura.id_cultura,
      cultura.planta_id,
      cultura.hectares,
      formatarDataSimples(cultura.data_plantio),
      formatarDataSimples(cultura.data_colheita),
    );
  } catch (err) {
    throw typeof err === "string" ? err : "Erro ao alterar a cultura: " + err;
  }
};

const deleteCulturaDB = async (codigo) => {
  try {
    const results = await query(
      `DELETE FROM culturas
             WHERE id_cultura = $1`,
      [codigo],
    );

    if (results.rowCount == 0) {
      throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
    } else {
      return "Cultura removida com sucesso";
    }
  } catch (err) {
    throw "Erro ao remover a cultura: " + err;
  }
};

const getCulturaPorCodigoDB = async (codigo) => {
  try {
    const results = await query(
      `SELECT * FROM culturas
             WHERE id_cultura = $1`,
      [codigo],
    );

    if (results.rowCount == 0) {
      throw "Nenhum registro encontrado com o código: " + codigo;
    } else {
      const cultura = results.rows[0];

      return new Cultura(
        cultura.id_cultura,
        cultura.planta_id,
        cultura.hectares,
        formatarDataSimples(cultura.data_plantio),
        formatarDataSimples(cultura.data_colheita),
      );
    }
  } catch (err) {
    throw "Erro ao recuperar a cultura: " + err;
  }
};

module.exports = {
  getCulturasDB,
  addCulturaDB,
  updateCulturaDB,
  deleteCulturaDB,
  getCulturaPorCodigoDB,
};
