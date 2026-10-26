const conexao = require('../Config/config')

function buscarPlantasAdmCalendario(callback) {
    const sql = `
        SELECT tipoPlanta, tempoDeColheita
        FROM plantaadm
    `;

    conexao.query(sql, callback);
}

module.exports = {
    buscarPlantasAdmCalendario
}