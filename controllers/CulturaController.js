const {
    getCulturasDB,
    addCulturaDB,
    updateCulturaDB,
    deleteCulturaDB,
    getCulturaPorCodigoDB
} = require('../usecases/culturaUseCases');

const getCulturas = async (request, response) => {
    await getCulturasDB()
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: 'Erro ao consultar as Culturas: ' + err
        }));
};

const addCultura = async (request, response) => {
    await addCulturaDB(request.body)
        .then(data => response.status(200).json({
            status: "success",
            message: "Cultura criada",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};

const updateCultura = async (request, response) => {
    // Injeta o ID da URL no corpo da requisição
    request.body.id_cultura = parseInt(request.params.codigo);

    await updateCulturaDB(request.body)
        .then(data => response.status(200).json({
            status: "success",
            message: "Cultura alterada",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};

const deleteCultura = async (request, response) => {
    await deleteCulturaDB(
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

const getCulturaPorCodigo = async (request, response) => {
    await getCulturaPorCodigoDB(
        parseInt(request.params.codigo)
    )
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};

module.exports = {
    getCulturas,
    addCultura,
    updateCultura,
    deleteCultura,
    getCulturaPorCodigo
};