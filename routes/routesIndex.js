// Arquivo de índice de rotas, que exporta um array com todas as rotas do sistema

const routesCulturas = require('./RotasCultura');
const routesPlantas = require('./RotasPlanta');
const routesManejos = require('./RotasManejo');
const routesSeguranca = require('./RotasSeguranca');

module.exports = [
  routesSeguranca,
  routesCulturas,
  routesPlantas,
  routesManejos,
];
