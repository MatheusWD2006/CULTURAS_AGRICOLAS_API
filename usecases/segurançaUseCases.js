const { query } = require('../configDB');
const User = require('../entities/user');

const autenticaUserDB = async (body) => {
    try {
        const { e_mail, passw } = body;

        const results = await query(
            `SELECT * FROM users WHERE e_mail = $1 AND passw = $2`,
            [e_mail, passw]
        );

        if (results.rowCount === 0) {
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

const cadastraUserDB = async (body) => {
    try {
        const { e_mail, passw, contato, nome_user } = body;

        // Verifica se já existe um usuário com o mesmo e-mail
        const userExiste = await query(
            `SELECT * FROM users WHERE e_mail = $1`,
            [e_mail]
        );

        if (userExiste.rowCount > 0) {
            throw "Já existe um usuário cadastrado com este e-mail.";
        }

        // Novos cadastros pelo front sempre iniciam com modo 'U' (Usuário comum)
        const results = await query(
            `INSERT INTO users (e_mail, passw, modo, contato, nome_user)
             VALUES ($1, $2, 'U', $3, $4)
             RETURNING e_mail, modo, contato, nome_user`,
            [e_mail, passw, contato, nome_user]
        );

        const usuario = results.rows[0];

        return new User(
            usuario.e_mail,
            usuario.modo,
            usuario.contato,
            usuario.nome_user
        );
    } catch (err) {
        throw "Erro ao cadastrar usuário: " + err;
    }
};

const getDadosUserDB = async (e_mail) => {
    try {
        const results = await query(
            `SELECT e_mail, modo, contato, nome_user FROM users WHERE e_mail = $1`,
            [e_mail]
        );

        if (results.rowCount === 0) {
            throw "Usuário não encontrado.";
        }

        const usuario = results.rows[0];

        return new User(
            usuario.e_mail,
            usuario.modo,
            usuario.contato,
            usuario.nome_user
        );
    } catch (err) {
        throw "Erro ao consultar dados do usuário: " + err;
    }
};

const updateUserDB = async (body, emailAutenticado) => {
    try {
        const { passw, contato, nome_user } = body;

        let results;
        if (passw && passw.trim() !== '') {
            results = await query(
                `UPDATE users 
                 SET passw = $1, contato = $2, nome_user = $3 
                 WHERE e_mail = $4 
                 RETURNING e_mail, modo, contato, nome_user`,
                [passw, contato, nome_user, emailAutenticado]
            );
        } else {
            results = await query(
                `UPDATE users 
                 SET contato = $1, nome_user = $2 
                 WHERE e_mail = $3 
                 RETURNING e_mail, modo, contato, nome_user`,
                [contato, nome_user, emailAutenticado]
            );
        }

        if (results.rowCount === 0) {
            throw "Usuário não encontrado para atualização.";
        }

        const usuario = results.rows[0];

        return new User(
            usuario.e_mail,
            usuario.modo,
            usuario.contato,
            usuario.nome_user
        );
    } catch (err) {
        throw "Erro ao atualizar dados do usuário: " + err;
    }
};

module.exports = {
    autenticaUserDB,
    cadastraUserDB,
    getDadosUserDB,
    updateUserDB
};
