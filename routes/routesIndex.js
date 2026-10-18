// Arquivo de índice de rotas, que exporta um array com todas as rotas do sistema (Cultura, Planta e Manejo).

const routesCulturas = require('./RotasCultura');
const routesPlantas = require('./RotasPlanta');
const routesManejos = require('./RotasManejo');

module.exports = [
  routesCulturas,
  routesPlantas,
  routesManejos,
];