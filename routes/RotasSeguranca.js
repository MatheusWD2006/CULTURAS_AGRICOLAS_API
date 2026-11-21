const { Router } = require('express');
const {
    login,
    novoUsuario,
    getDadosUsuarioLogado,
    updateDadosUsuarioLogado,
    verificaJWT
} = require('../controllers/segurançaController');

const rotasSeguranca = new Router();

// Rota pública para autenticação
rotasSeguranca.route('/login')
    .post(login);

// Rota pública para criação de novo usuário (Requisito 3)
rotasSeguranca.route('/usuario/novo')
    .post(novoUsuario);

// Rotas protegidas para visualizar e atualizar os dados do próprio usuário (Requisito 4)
rotasSeguranca.route('/usuario/meusdados')
    .get(verificaJWT, getDadosUsuarioLogado)
    .put(verificaJWT, updateDadosUsuarioLogado);

module.exports = rotasSeguranca;
