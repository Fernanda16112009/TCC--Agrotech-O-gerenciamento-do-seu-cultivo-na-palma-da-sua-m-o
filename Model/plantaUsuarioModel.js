const conexao = require('../Config/config')

function criarPlantaUsuario(plantausuario,  callback) {
    const sql = `
        
        INSERT INTO plantausuario
        (idUsuario, planta, tipoPlanta, safraNumero, quantidade, longitude, latitude, data_plantacao, agrotoxico)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    conexao.query(sql, [
        plantausuario.idUsuario,
        plantausuario.planta,
        plantausuario.tipoPlanta,
        plantausuario.safraNumero,
        plantausuario.quantidade,
        plantausuario.longitude,
        plantausuario.latitude,
        plantausuario.data_plantacao,
        plantausuario.agrotoxico,
    ], callback)
}

function buscarNumeroSafra(idUsuario, tipoPlanta, callback){
    const sql = `SELECT safraNumero FROM plantausuario WHERE idUsuario = ? AND tipoPlanta = ? ORDER BY safraNumero DESC
LIMIT 1`
    conexao.query(sql, [idUsuario,tipoPlanta], callback)
}

function cadastrarAnotacao( anotacao, idUsuario, idPlanta,  callback){
    const sql = `
        UPDATE plantausuario
        SET anotacao = ?
        WHERE idUsuario = ?
        AND idPlanta = ?
        `
    console.log(anotacao)
    conexao.query(sql, [
        anotacao.anotacao,
        idUsuario,
        idPlanta,
    ], callback)
}

function buscarAnotacoes( idUsuario, idPlanta, callback){
    const sql = `SELECT anotacao FROM plantausuario WHERE idUsuario = ? AND idPlanta = ?`
    conexao.query(sql, [idUsuario,idPlanta], callback)
}

function buscarPlantaPorUsuario(idUsuario, callback) {
    const sql = `SELECT * FROM plantausuario WHERE idUsuario = ?`
    conexao.query(sql, [idUsuario], callback)
}

function buscarPlantaPorIdPlanta(idUsuario, idPlanta, callback){
    const sql = `SELECT * FROM plantausuario WHERE idUsuario = ? AND idPlanta = ?`
    conexao.query(sql, [idUsuario,idPlanta], callback)
}

function buscarPlantaPorNome(idUsuario,nomePlanta, callback) {
    const sql = `SELECT * FROM plantausuario WHERE idUsuario = ? AND nomePlanta LIKE ? ORDER BY nomePlanta`
    conexao.query(sql, [idUsuario,`%${nomePlanta}%`], callback)
}

function deletarPlanta(idUsuario, idPlanta, callback) {
    const sql = `DELETE FROM plantausuario WHERE idUsuario = ? AND idPlanta = ?`
    conexao.query(sql,[idUsuario,idPlanta], callback)
}
module.exports = {
    criarPlantaUsuario,
    buscarNumeroSafra,
    cadastrarAnotacao,
    buscarAnotacoes,
    buscarPlantaPorUsuario,
    buscarPlantaPorIdPlanta,
    buscarPlantaPorNome,
    deletarPlanta 
}
