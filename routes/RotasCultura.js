const { Router } = require('express');
const {
    getCulturas,
    addCultura,
    updateCultura,
    deleteCultura,
    getCulturaPorCodigo
} = require('../controllers/CulturaController');
const {
    verificaJWT,
    verificaAdmin
} = require('../controllers/segurançaController');

const rotasCultura = new Router();

rotasCultura.route('/cultura')
    .get(verificaJWT, getCulturas)
    .post(verificaJWT, addCultura); 

rotasCultura.route('/cultura/:codigo')
    .get(verificaJWT, getCulturaPorCodigo)
    .put(verificaJWT, updateCultura)    
    .delete(verificaJWT, verificaAdmin, deleteCultura);

module.exports = rotasCultura;
