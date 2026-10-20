const { Router } = require('express');
const {
    getCulturas,
    addCultura,
    updateCultura,
    deleteCultura,
    getCulturaPorCodigo
} = require('../controllers/CulturaController');

const rotasCultura = new Router();

rotasCultura.route('/cultura')
    .get(getCulturas)
    .post(addCultura); 

rotasCultura.route('/cultura/:codigo')
    .get(getCulturaPorCodigo)
    .put(updateCultura)    
    .delete(deleteCultura);

module.exports = rotasCultura;