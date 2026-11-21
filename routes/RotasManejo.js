const { Router } = require('express');
const {
    getManejos,
    addManejo,
    updateManejo,
    deleteManejo,
    getManejoPorCodigo
} = require('../controllers/ManejoController');
const {
    verificaJWT,
    verificaAdmin
} = require('../controllers/segurançaController');

const rotasManejo = new Router();

rotasManejo.route('/manejo')
    .get(verificaJWT, getManejos)
    .post(verificaJWT, addManejo); 

rotasManejo.route('/manejo/:codigo')
    .get(verificaJWT, getManejoPorCodigo)
    .put(verificaJWT, updateManejo)  
    .delete(verificaJWT, verificaAdmin, deleteManejo);

module.exports = rotasManejo;
