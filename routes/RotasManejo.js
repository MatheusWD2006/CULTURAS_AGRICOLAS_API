const { Router } = require('express');
const {
    getManejos,
    addManejo,
    updateManejo,
    deleteManejo,
    getManejoPorCodigo
} = require('../controllers/ManejoController');

const rotasManejo = new Router();

rotasManejo.route('/Manejo')
    .get(getManejos)
    .post(addManejo); 

rotasManejo.route('/Manejo/:codigo')
    .get(getManejoPorCodigo)
    .put(updateManejo)  
    .delete(deleteManejo);

module.exports = rotasManejo;