const { pool } = require('../config');
const User = require('../entities/user');

const autenticaUserDB = async (body) => {
    try {
        const { e_mail, passw } = body;

        const results = await pool.query(
            `SELECT * FROM users WHERE e_mail = $1 AND passw = $2`,
            [e_mail, passw]
        );

        if (results.rowCount == 0) {
            throw "Usuário ou senha inválidos";
        }

        const usuario = results.rows[0];

        return new User(
            usuario.e_mail,
            usuario.modo,
            usuario.contato,
            usuario.nome_user
        );
    } catch (err) {
        throw "Erro ao autenticar o usuário: " + err;
    }
};

module.exports = {
    autenticaUserDB
};