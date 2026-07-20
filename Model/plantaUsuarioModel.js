const conexao = require('../Config/config')

function criarPlantaUsuario(plantausuario, callback) {
    const sql = `

        
        INSERT INTO plantausuario
        (nomePlanta, quantidade, localizacao, data_plantacao, agrotoxico)
        VALUES (?, ?, ?, ?, ?)
    `
    conexao.query(sql, [
        plantausuario.nomePlanta,
        plantausuario.quantidade,
        plantausuario.localizacao,
        plantausuario.data_plantacao,
        plantausuario.agrotoxico,
    ], callback)
}

module.exports = {
    criarPlantaUsuario,
}