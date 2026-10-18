const {
    getManejosDB,
    addManejoDB,
    updateManejoDB,
    deleteManejoDB,
    getManejoPorCodigoDB
} = require('../usecases/manejoUseCases');

const getManejos = async (request, response) => {
    await getManejosDB()
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: 'Erro ao consultar as Manejos: ' + err
        }));
};

const addManejo = async (request, response) => {
    await addManejoDB(request.body)
        .then(data => response.status(200).json({
            status: "success",
            message: "Manejo criada",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};

const updateManejo = async (request, response) => {
    // Injeta o ID da URL no corpo da requisição
    request.body.id_manejo = parseInt(request.params.codigo);

    await updateManejoDB(request.body)
        .then(data => response.status(200).json({
            status: "success",
            message: "Manejo alterado",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};

const deleteManejo = async (request, response) => {
    await deleteManejoDB(
        parseInt(request.params.codigo)
    )
        .then(data => response.status(200).json({
            status: "success",
            message: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};

const getManejoPorCodigo = async (request, response) => {
    await getManejoPorCodigoDB(
        parseInt(request.params.codigo)
    )
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};

module.exports = {
    getManejos,
    addManejo,
    updateManejo,
    deleteManejo,
    getManejoPorCodigo
};