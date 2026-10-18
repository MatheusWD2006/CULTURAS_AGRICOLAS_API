const { Router } = require('express');
const todasAsRotas = require('./routesIndex');

const rotas = new Router();

// Registra todas as rotas percorrendo o array
todasAsRotas.forEach(rota => rotas.use(rota));

module.exports = rotas;