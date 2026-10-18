const { query } = require("../configDB");
const Manejo = require("../entities/Manejos");
const {
  formatarDataSimples,
  validarDataManejo,
  validarDataNoIntervalo,
} = require("../utils/dateUtils");

// Busca a cultura e confere se a data do manejo cai dentro do período dela
const validarManejoNaCultura = async (cultura_id, data_manejo) => {
  const { rows } = await query(
    "SELECT data_plantio, data_colheita FROM culturas WHERE id_cultura = $1",
    [cultura_id],
  );

  if (rows.length === 0) {
    throw `A cultura com o código ${cultura_id} não existe no cadastro.`;
  }

  validarDataNoIntervalo(
    data_manejo,
    formatarDataSimples(rows[0].data_plantio),
    formatarDataSimples(rows[0].data_colheita),
  );
};

const getManejosDB = async () => {
  try {
    const { rows } = await query("SELECT * FROM manejos ORDER BY id_manejo");

    return rows.map(
      (manejo) =>
        new Manejo(
          manejo.id_manejo,
          manejo.cultura_id,
          manejo.tipo_manejo,
          manejo.descricao_manejo,
          formatarDataSimples(manejo.data_manejo),
        ),
    );
  } catch (err) {
    throw "Erro : " + err;
  }
};

const addManejoDB = async (body) => {
  try {
    const { cultura_id, tipo_manejo, descricao_manejo, data_manejo } = body;

    // Data real e não futura
    validarDataManejo(data_manejo);
    // Dentro do período da cultura
    await validarManejoNaCultura(cultura_id, data_manejo);

    const results = await query(
      `INSERT INTO manejos (cultura_id, tipo_manejo, descricao_manejo, data_manejo)
             VALUES ($1, $2, $3, $4)
             RETURNING id_manejo, cultura_id, tipo_manejo, descricao_manejo, data_manejo`,
      [cultura_id, tipo_manejo, descricao_manejo, data_manejo],
    );

    const manejo = results.rows[0];

    return new Manejo(
      manejo.id_manejo,
      manejo.cultura_id,
      manejo.tipo_manejo,
      manejo.descricao_manejo,
      formatarDataSimples(manejo.data_manejo),
    );
  } catch (err) {
    if (err.code === "23503") {
      throw `A cultura com o código ${body.cultura_id} não existe no cadastro.`;
    }
    throw typeof err === "string" ? err : "Erro ao inserir o manejo: " + err;
  }
};

const updateManejoDB = async (body) => {
  try {
    const { id_manejo, cultura_id, tipo_manejo, descricao_manejo, data_manejo } = body;

    // Data real e não futura
    validarDataManejo(data_manejo);
    // Dentro do período da cultura
    await validarManejoNaCultura(cultura_id, data_manejo);

    const results = await query(
      `UPDATE manejos
             SET cultura_id = $2, tipo_manejo = $3, descricao_manejo = $4, data_manejo = $5
             WHERE id_manejo = $1
             RETURNING id_manejo, cultura_id, tipo_manejo, descricao_manejo, data_manejo`,
      [id_manejo, cultura_id, tipo_manejo, descricao_manejo, data_manejo],
    );

    if (results.rowCount == 0) {
      throw `Nenhum registro encontrado com o código ${id_manejo} para ser alterado`;
    }

    const manejo = results.rows[0];

    return new Manejo(
      manejo.id_manejo,
      manejo.cultura_id,
      manejo.tipo_manejo,
      manejo.descricao_manejo,
      formatarDataSimples(manejo.data_manejo),
    );
  } catch (err) {
    throw typeof err === "string" ? err : "Erro ao alterar o manejo: " + err;
  }
};

const deleteManejoDB = async (codigo) => {
  try {
    const results = await query(
      `DELETE FROM manejos
             WHERE id_manejo = $1`,
      [codigo],
    );

    if (results.rowCount == 0) {
      throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
    } else {
      return "Manejo removido com sucesso";
    }
  } catch (err) {
    throw "Erro ao remover o manejo: " + err;
  }
};

const getManejoPorCodigoDB = async (codigo) => {
  try {
    const results = await query(
      `SELECT * FROM manejos
             WHERE id_manejo = $1`,
      [codigo],
    );

    if (results.rowCount == 0) {
      throw "Nenhum registro encontrado com o código: " + codigo;
    } else {
      const manejo = results.rows[0];

      return new Manejo(
        manejo.id_manejo,
        manejo.cultura_id,
        manejo.tipo_manejo,
        manejo.descricao_manejo,
        formatarDataSimples(manejo.data_manejo),
      );
    }
  } catch (err) {
    throw "Erro ao recuperar o manejo: " + err;
  }
};

module.exports = {
  getManejosDB,
  addManejoDB,
  updateManejoDB,
  deleteManejoDB,
  getManejoPorCodigoDB,
};