const { query } = require("../configDB");
const Cultura = require("../entities/Culturas");
const { formatarDataSimples, validarIntervaloDatas } = require('../utils/dateUtils');

const getCulturasDB = async () => {
  try {
    const { rows } = await query(
      `SELECT c.id_cultura, c.planta_id, c.hectares, c.data_plantio, c.data_colheita, p.nome_planta as planta_nome
       FROM culturas c
       JOIN plantas p ON c.planta_id = p.id_planta
       ORDER BY c.id_cultura`
    );

    return rows.map(
      (cultura) =>
        new Cultura(
          cultura.id_cultura,
          cultura.planta_id,
          cultura.hectares,
          formatarDataSimples(cultura.data_plantio),
          formatarDataSimples(cultura.data_colheita),
          cultura.planta_nome,
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

    // Busca o nome da planta para retorno completo
    const plantaResult = await query(
      `SELECT nome_planta FROM plantas WHERE id_planta = $1`,
      [planta_id]
    );
    const planta_nome = plantaResult.rowCount > 0 ? plantaResult.rows[0].nome_planta : null;

    return new Cultura(
      cultura.id_cultura,
      cultura.planta_id,
      cultura.hectares,
      formatarDataSimples(cultura.data_plantio),
      formatarDataSimples(cultura.data_colheita),
      planta_nome,
    );
  } catch (err) {
    if (err.code === "23503") {
      throw `A planta com o código ${body.planta_id} não existe no cadastro.`;
    }
    // Se for um erro lançado pelas validações de data, repassa diretamente a mensagem
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

    // Busca o nome da planta para retorno completo
    const plantaResult = await query(
      `SELECT nome_planta FROM plantas WHERE id_planta = $1`,
      [planta_id]
    );
    const planta_nome = plantaResult.rowCount > 0 ? plantaResult.rows[0].nome_planta : null;

    return new Cultura(
      cultura.id_cultura,
      cultura.planta_id,
      cultura.hectares,
      formatarDataSimples(cultura.data_plantio),
      formatarDataSimples(cultura.data_colheita),
      planta_nome,
    );
  } catch (err) {
    if (err.code === "23503") {
      throw `A planta com o código ${body.planta_id} não existe no cadastro.`;
    }
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
    if (err.code === "23503") {
      throw `Não é possível remover a cultura de código ${codigo} pois existem manejos vinculados a ela.`;
    }
    throw typeof err === "string" ? err : "Erro ao remover a cultura: " + err;
  }
};

const getCulturaPorCodigoDB = async (codigo) => {
  try {
    const results = await query(
      `SELECT c.id_cultura, c.planta_id, c.hectares, c.data_plantio, c.data_colheita, p.nome_planta as planta_nome
       FROM culturas c
       JOIN plantas p ON c.planta_id = p.id_planta
       WHERE c.id_cultura = $1`,
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
        cultura.planta_nome,
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
