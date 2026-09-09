const conexao = require('../Config/config')

function buscarPlantasAdmCalendario(callback) {
    const sql = `
        SELECT tipoPlanta, tempoDeColheita
        FROM plantaADM
    `;

    conexao.query(sql, callback);
}

module.exports = {
    buscarPlantasAdmCalendario
}