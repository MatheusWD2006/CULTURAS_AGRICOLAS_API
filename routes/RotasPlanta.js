const { Router } = require('express');
const {
    getPlantas,
    addPlanta,
    updatePlanta,
    deletePlanta,
    getPlantaPorCodigo
} = require('../controllers/PlantaController');
const {
    verificaJWT,
    verificaAdmin
} = require('../controllers/segurançaController');

const rotasPlanta = new Router();

rotasPlanta.route('/planta')
    .get(verificaJWT, getPlantas)
    .post(verificaJWT, addPlanta);

rotasPlanta.route('/planta/:codigo')
    .get(verificaJWT, getPlantaPorCodigo)
    .put(verificaJWT, updatePlanta)    
    .delete(verificaJWT, verificaAdmin, deletePlanta);

module.exports = rotasPlanta;
