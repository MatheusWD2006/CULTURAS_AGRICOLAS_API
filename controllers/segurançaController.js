const {
    autenticaUserDB,
    cadastraUserDB,
    getDadosUserDB,
    updateUserDB
} = require('../usecases/segurançaUseCases');

const path = require('path');
require("dotenv-safe").config({
    path: path.resolve(__dirname, '../.env'),
    example: path.resolve(__dirname, '../.env.example'),
    allowEmptyValues: true
});

const jwt = require('jsonwebtoken');

const login = async (request, response) => {
    // Aceita tanto { e_mail, passw } quanto { email, senha }
    const credenciais = {
        e_mail: request.body.e_mail || request.body.email,
        passw: request.body.passw || request.body.senha
    };

    await autenticaUserDB(credenciais)
        .then(usuario => {
            const token = jwt.sign(
                { usuario },
                process.env.SECRET,
                {
                    expiresIn: 3600 // expira em 1 hora
                }
            );

            return response.json({
                auth: true,
                token: token,
                usuario: usuario
            });
        })
        .catch(err => {
            response.status(401).json({
                auth: false,
                message: err
            });
        });
};

const novoUsuario = async (request, response) => {
    const dados = {
        e_mail: request.body.e_mail || request.body.email,
        passw: request.body.passw || request.body.senha,
        contato: request.body.contato || request.body.telefone,
        nome_user: request.body.nome_user || request.body.nome
    };

    await cadastraUserDB(dados)
        .then(usuario => {
            response.status(200).json({
                status: 'success',
                message: 'Usuário cadastrado com sucesso!',
                objeto: usuario
            });
        })
        .catch(err => {
            response.status(400).json({
                status: 'error',
                message: err
            });
        });
};

const getDadosUsuarioLogado = async (request, response) => {
    // Obtém estritamente os dados do usuário autenticado pelo token
    await getDadosUserDB(request.usuario.e_mail)
        .then(usuario => {
            response.status(200).json(usuario);
        })
        .catch(err => {
            response.status(400).json({
                status: 'error',
                message: err
            });
        });
};

const updateDadosUsuarioLogado = async (request, response) => {
    // Atualiza apenas os dados do usuário autenticado pelo token
    const dados = {
        passw: request.body.passw || request.body.senha,
        contato: request.body.contato || request.body.telefone,
        nome_user: request.body.nome_user || request.body.nome
    };

    await updateUserDB(dados, request.usuario.e_mail)
        .then(usuario => {
            response.status(200).json({
                status: 'success',
                message: 'Dados atualizados com sucesso!',
                objeto: usuario
            });
        })
        .catch(err => {
            response.status(400).json({
                status: 'error',
                message: err
            });
        });
};

// Verificação do token JWT
function verificaJWT(request, response, next) {
    const token = request.headers['authorization'];

    if (!token) {
        return response.status(401).json({
            auth: false,
            message: 'Nenhum token recebido.'
        });
    }

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
            return response.status(401).json({
                auth: false,
                message: 'Erro ao autenticar o token.'
            });
        }

        // Salva os dados do usuário no request para os controllers e autorizações
        request.usuario = decoded.usuario;
        next();
    });
}

// Controle de autorização: apenas administradores (modo === 'A')
function verificaAdmin(request, response, next) {
    if (request.usuario && request.usuario.modo === 'A') {
        next();
    } else {
        return response.status(403).json({
            auth: false,
            message: 'Acesso negado: operação permitida apenas para administradores.'
        });
    }
}

module.exports = {
    login,
    novoUsuario,
    getDadosUsuarioLogado,
    updateDadosUsuarioLogado,
    verificaJWT,
    verificaAdmin
};
