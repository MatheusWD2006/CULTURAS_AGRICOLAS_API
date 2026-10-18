//Arquivo de utilidades para manipulação de datas


// Retorna apenas a parte da data no formato padrão (AAAA-MM-DD).
const formatarDataSimples = (data) => {
    if (!data) return null;

    if (data instanceof Date) {
        if (isNaN(data.getTime())) return null;
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");
        return `${ano}-${mes}-${dia}`;
    }

    // String: pega só AAAA-MM-DD (cobre "2026-10-13T00:00:00.000Z")
    return String(data).slice(0, 10);
};

// Data de hoje (local do servidor) no formato AAAA-MM-DD
const obterDataHoje = () => formatarDataSimples(new Date());

/**
 * Valida se uma string de data (YYYY-MM-DD) representa uma data real válida no calendário.
 */
const eDataValida = (dataString) => {
    if (!dataString) return false;

    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexData.test(dataString)) return false;

    const [ano, mes, dia] = dataString.split('-').map(Number);

    if (mes < 1 || mes > 12) return false;
    if (dia < 1 || dia > 31) return false;

    const data = new Date(Date.UTC(ano, mes - 1, dia));

    return (
        data.getUTCFullYear() === ano &&
        data.getUTCMonth() === mes - 1 &&
        data.getUTCDate() === dia
    );
};

/**
 * Valida o intervalo entre plantio e colheita:
 * - plantio deve ser uma data real
 * - colheita (se informada) deve ser uma data real, posterior ao plantio e não futura
 */
const validarIntervaloDatas = (dataPlantio, dataColheita) => {
    if (!eDataValida(dataPlantio)) {
        throw "A data de plantio informada é inválida ou inexistente.";
    }

    if (dataColheita) {
        if (!eDataValida(dataColheita)) {
            throw "A data de colheita informada é inválida ou inexistente.";
        }

        // Compara diretamente as strings em formato AAAA-MM-DD (alfabeticamente)
        if (dataColheita <= dataPlantio) {
            throw "A data de colheita não pode ser anterior nem igual à data de plantio.";
        }

        if (dataColheita > obterDataHoje()) {
            throw "A data de colheita não pode ser uma data futura.";
        }
    }
};

/**
 * Valida a data de um manejo: deve ser uma data real e não futura.
 */
const validarDataManejo = (dataManejo) => {
    if (!eDataValida(dataManejo)) {
        throw "A data do manejo informada é inválida ou inexistente.";
    }

    if (dataManejo > obterDataHoje()) {
        throw "A data do manejo não pode ser uma data futura.";
    }
};

const paraBR = (iso) => iso.split("-").reverse().join("/");

/**
 * Valida se uma data (AAAA-MM-DD) está dentro do intervalo [inicio, fim].
 * Se "fim" for null, só o limite inferior vale.
 */
const validarDataNoIntervalo = (data, inicio, fim) => {
    if (data < inicio) {
        throw `A data do manejo não pode ser anterior ao plantio da cultura (${paraBR(inicio)}).`;
    }

    if (fim && data >= fim) {
        throw `A data do manejo não pode ser posterior ou igual à colheita da cultura (${paraBR(fim)}).`;
    }
};

module.exports = {
    formatarDataSimples,
    eDataValida,
    validarIntervaloDatas,
    validarDataManejo,
    validarDataNoIntervalo
};

