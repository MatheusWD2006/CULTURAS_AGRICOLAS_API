const { Router } = require('express');

const {
    getPlantas,
    addPlanta,
    updatePlanta,
    deletePlanta,
    getPlantaPorCodigo
} = require('../controllers/PlantaController');

const rotasPlanta = new Router();

rotasPlanta.route('/planta')
    .get(getPlantas)
    .post(addPlanta);

rotasPlanta.route('/planta/:codigo')
    .get(getPlantaPorCodigo)
    .put(updatePlanta)    
    .delete(deletePlanta);

module.exports = rotasPlanta;