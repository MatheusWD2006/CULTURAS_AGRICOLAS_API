const {
    getPlantasDB,
    addPlantaDB,
    updatePlantaDB,
    deletePlantaDB,
    getPlantaPorCodigoDB
} = require('../usecases/plantaUseCases');

const getPlantas = async (request, response) => {
    await getPlantasDB()
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: 'Erro ao consultar as Plantas: ' + err
        }));
};

const addPlanta = async (request, response) => {
    await addPlantaDB(request.body)
        .then(data => response.status(200).json({
            status: "success",
            message: "Planta criada",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};

const updatePlanta = async (request, response) => {
    // Injeta o ID da URL no corpo da requisição
    request.body.id_planta = parseInt(request.params.codigo);

    await updatePlantaDB(request.body)
        .then(data => response.status(200).json({
            status: "success",
            message: "Planta alterada",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};
const deletePlanta = async (request, response) => {
    await deletePlantaDB(
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

const getPlantaPorCodigo = async (request, response) => {
    await getPlantaPorCodigoDB(
        parseInt(request.params.codigo)
    )
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};

module.exports = {
    getPlantas,
    addPlanta,
    updatePlanta,
    deletePlanta,
    getPlantaPorCodigo
};